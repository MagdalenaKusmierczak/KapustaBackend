const months = require("../../helpers/months");
const Categories = require("../../helpers/categories");
const User = require("../../models/User");

const addIncome = async (req, res) => {
  const user = req.user;
  const { description, amount, date, category } = req.body;
  const transaction = {
    description,
    amount,
    date,
    category,
  };

  user.transactions.push(transaction);

  user.balance += amount;

  await user.save();

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    newBalance: user.balance,
    transaction: user.transactions[user.transactions.length - 1],
  });
};

const getIncome = async (req, res) => {
  const user = req.user;

  let monthsStatistics = {};

  const incomes = user.transactions.filter((transaction) => {
    return (
      transaction.category === Categories.SALARY ||
      transaction.category === Categories.ADDITIONAL_INCOME
    );
  });

  for (let i = 0; i < 12; i++) {
    let total = 0;
    const monthName = months[i];

    const transactions = incomes.filter((transaction) => {
      return (
        Number(transaction.date.split("-")[1]) === i + 1 &&
        Number(transaction.date.split("-")[0]) === new Date().getFullYear()
      );
    });

    if (!transactions.length) {
      monthsStatistics[monthName] = "N/A";
      continue;
    }

    for (const transaction of transactions) {
      total += transaction.amount;
    }
    monthsStatistics[monthName] = total;
  }

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    incomes,
    monthsStatistics,
  });
};

const getIncomeCategories = async (req, res) => {
  const incomeCategories = [];

  for (const category of Object.values(Categories)) {
    if (
      category === Categories.SALARY ||
      category === Categories.ADDITIONAL_INCOME
    ) {
      incomeCategories.push(category);
    }
  }

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    incomeCategories,
  });
};

const addExpense = async (req, res) => {
  const user = req.user;
  const { description, amount, date, category } = req.body;
  const transaction = {
    description,
    amount,
    date,
    category,
  };

  user.transactions.push(transaction);

  user.balance -= amount;

  await user.save();

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    newBalance: user.balance,
    transaction: user.transactions[user.transactions.length - 1],
  });
};

const getExpense = async (req, res) => {
  const user = req.user;
  let monthsStatistics = {};

  const expenses = user.transactions.filter((transaction) => {
    return (
      transaction.category !== Categories.SALARY &&
      transaction.category !== Categories.ADDITIONAL_INCOME
    );
  });

  for (let i = 0; i < 12; i++) {
    let total = 0;
    const monthName = months[i];

    const transactions = expenses.filter((transaction) => {
      return (
        Number(transaction.date.split("-")[1]) === i + 1 &&
        Number(transaction.date.split("-")[0]) === new Date().getFullYear()
      );
    });

    if (!transactions.length) {
      monthsStatistics[monthName] = "N/A";
      continue;
    }

    for (const transaction of transactions) {
      total += transaction.amount;
    }
    monthsStatistics[monthName] = total;
  }

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    expenses,
    monthsStatistics,
  });
};

const getExpenseCategories = async (req, res) => {
  const expenseCategories = [];
  for (const category of Object.values(Categories)) {
    if (
      category !== Categories.SALARY &&
      category !== Categories.ADDITIONAL_INCOME
    ) {
      expenseCategories.push(category);
    }
  }

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    expenseCategories,
  });
};

const getTransactionsPeriodData = async (req, res) => {
  const user = req.user;
  const transactions = user.transactions;
  const { date } = req.query;

  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!date || !dateRegex.test(date)) {
    return res.status(400).json({
      status: "Error",
      code: 400,
      message: "Invalid date format. Please use YYYY-MM.",
    });
  }

  const [year, month] = date.split("-").map(Number);

  let incomesData = {};
  let incomesSum = 0;
  let expensesData = {};
  let expensesSum = 0;

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();

    if (transactionMonth === month && transactionYear === year) {
      const category = transaction.category;
      const description = transaction.description;

      if (
        category === Categories.SALARY ||
        category === Categories.ADDITIONAL_INCOME
      ) {
        if (!incomesData[category]) {
          incomesData[category] = {
            total: transaction.amount,
            [description]: transaction.amount,
          };
          incomesSum += transaction.amount;
        } else {
          if (!incomesData[category][description]) {
            incomesData[category].total += transaction.amount;
            incomesData[category][description] = transaction.amount;
            incomesSum += transaction.amount;
          } else {
            incomesData[category].total += transaction.amount;
            incomesData[category][description] += transaction.amount;
            incomesSum += transaction.amount;
          }
        }
      } else {
        if (!expensesData[category]) {
          expensesData[category] = {
            total: Math.abs(transaction.amount),
            [description]: Math.abs(transaction.amount),
          };
          expensesSum += Math.abs(transaction.amount);
        } else {
          if (!expensesData[category][description]) {
            expensesData[category].total += Math.abs(transaction.amount);
            expensesData[category][description] = Math.abs(transaction.amount);
            expensesSum += Math.abs(transaction.amount);
          } else {
            expensesData[category].total += Math.abs(transaction.amount);
            expensesData[category][description] += Math.abs(transaction.amount);
            expensesSum += Math.abs(transaction.amount);
          }
        }
      }
    }
  });

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    incomes: {
      total: incomesSum,
      incomesData,
    },
    expenses: {
      total: expensesSum,
      expensesData,
    },
  });
};

const deleteTransaction = async (req, res) => {
  const user = req.user;
  const { transactionId } = req.params;
  const transaction = user.transactions.find(
    (transaction) => transaction._id.toString() === transactionId
  );

  if (!transaction) {
    return res.status(404).json({
      code: 404,
      status: "Not found",
      message: "Transaction not found",
    });
  }

  if (
    transaction.category !== Categories.SALARY &&
    transaction.category !== Categories.ADDITIONAL_INCOME
  ) {
    user.balance += transaction.amount;
  } else {
    user.balance -= transaction.amount;
  }

  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { transactions: { _id: transactionId } },
      $set: { balance: user.balance },
    }
  );

  return res.status(200).json({
    status: "Successful operation",
    code: 200,
    newBalance: user.balance,
  });
};

module.exports = {
  addIncome,
  getIncome,
  getIncomeCategories,
  addExpense,
  getExpense,
  getExpenseCategories,
  getTransactionsPeriodData,
  deleteTransaction,
};
