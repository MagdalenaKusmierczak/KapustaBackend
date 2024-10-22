const months = require("../../helpers/months");
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

  res.json({
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
    if (
      transaction.category === Categories.SALARY ||
      transaction.category === Categories.ADDITIONAL_INCOME
    ) {
      return true;
    }
    return false;
  });

  for (let i = 0; i <= 11; i++) {
    let total = 0;
    const monthName = months[i];

    const transactions = incomes?.filter((transaction) => {
      if (
        Number(transaction.date.split("-")[1]) === i &&
        Number(transaction.date.split("-")[0]) === new Date().getFullYear()
      ) {
        return true;
      }
      return false;
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

  return res.json({
    status: "Successful operation",
    code: 200,
    incomes,
    monthsStatistics,
  });
};

const getIncomeCategorized = async (req, res) => {};

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

  res.json({
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
    if (
      transaction.category !== Categories.SALARY ||
      transaction.category !== Categories.ADDITIONAL_INCOME
    ) {
      return true;
    }
    return false;
  });

  for (let i = 0; i <= 11; i++) {
    let total = 0;
    const monthName = months[i];

    const transactions = expenses?.filter((transaction) => {
      if (
        Number(transaction.date.split("-")[1]) === i &&
        Number(transaction.date.split("-")[0]) === new Date().getFullYear()
      ) {
        return true;
      }
      return false;
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

  return res.json({
    status: "Successful operation",
    code: 200,
    incomes,
    monthsStatistics,
  });
};

const getExpenseCategorized = async (req, res) => {};

const getTransactionsPeriodData = async (req, res) => {};

const deleteTransaction = async (req, res) => {
  const user = req.user;
  const { transactionId } = req.params;
  const transaction = user.transaction.find(
    (transaction) => transaction._id?.toString() === transactionId
  );

  if (!transaction) {
    return res.json({
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
    { _id: req.user?._id },
    {
      $pull: { transactions: { _id: transactionId } },
      $set: { balance: user.balance },
    }
  );

  return res.json({
    status: "Successful operation",
    code: 200,
    newBalance: user.balance,
  });
};

module.exports = {
  addIncome,
  getIncome,
  getIncomeCategorized,
  addExpense,
  getExpense,
  getExpenseCategorized,
  getTransactionsPeriodData,
  deleteTransaction,
};


// // Endpoint: GET /transaction/income-categories
// router.get("/transaction/income-categories", async (req, res) => {
//   try {
//     if (!req.session.userId) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const user = await User.findById(req.session.userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const categories = user.transactions.map(
//       (transaction) => transaction.category
//     );

//     const uniqueCategories = [...new Set(categories)];

//     res.json(uniqueCategories);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/transaction/expense-categories", async (req, res) => {
//   try {
//     const expenseCategories = [
//       "Produkty",
//       "Alkohol",
//       "Rozrywka",
//       "Zdrowie",
//       "Transport",
//       "Wszystko dla domu",
//       "Technika",
//       "Komunikacja i media",
//       "Sport i hobby",
//       "Edukacja",
//       "Inne",
//     ];
//     res.json(expenseCategories);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.get("/transaction/period-data", async (req, res) => {
//   try {
//     const { date } = req.query;
//     if (!date) {
//       return res.status(400).json({ error: "Date parameter is required" });
//     }

//     const startDate = new Date(`${date}-01`);
//     const endDate = new Date(startDate);
//     endDate.setMonth(endDate.getMonth() + 1);

//     const user = await User.findById(req.session.userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const transactionsInPeriod = user.transactions.filter(
//       (transaction) =>
//         new Date(transaction.date) >= startDate &&
//         new Date(transaction.date) < endDate
//     );

//     const incomes = transactionsInPeriod.filter(
//       (transaction) => transaction.amount > 0
//     );
//     const expenses = transactionsInPeriod.filter(
//       (transaction) => transaction.amount < 0
//     );

//     const incomesData = {};
//     const expensesData = {};

//     incomes.forEach((income) => {
//       const category = income.category;
//       if (!incomesData[category]) {
//         incomesData[category] = { total: 0 };
//       }
//       incomesData[category].total += income.amount;
//       if (!incomesData[category][income.description]) {
//         incomesData[category][income.description] = 0;
//       }
//       incomesData[category][income.description] += income.amount;
//     });

//     expenses.forEach((expense) => {
//       const category = expense.category;
//       if (!expensesData[category]) {
//         expensesData[category] = { total: 0 };
//       }
//       expensesData[category].total += Math.abs(expense.amount);
//       if (!expensesData[category][expense.description]) {
//         expensesData[category][expense.description] = 0;
//       }
//       expensesData[category][expense.description] += Math.abs(expense.amount);
//     });

//     const response = {
//       incomes: {
//         total: incomes.reduce((sum, income) => sum + income.amount, 0),
//         incomesData: incomesData,
//       },
//       expenses: {
//         total: expenses.reduce(
//           (sum, expense) => sum + Math.abs(expense.amount),
//           0
//         ),
//         expensesData: expensesData,
//       },
//     };

//     res.json(response);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
