const express = require("express");
const { authorization } = require("../../controllers/authorization/auth");
const {
  addIncome,
  getIncome,
  getIncomeCategories,
  addExpense,
  getExpense,
  getExpenseCategories,
  getTransactionsPeriodData,
  deleteTransaction,
} = require("../../controllers/transactions/transactions");

const transactionsRouter = express.Router();

transactionsRouter.post("/income", authorization, addIncome);
transactionsRouter.get("/income", authorization, getIncome);
transactionsRouter.get(
  "/income-categories",
  authorization,
  getIncomeCategories,
);
transactionsRouter.post("/expense", authorization, addExpense);
transactionsRouter.get("/expense", authorization, getExpense);
transactionsRouter.get(
  "/expense-categories",
  authorization,
  getExpenseCategories,
);
transactionsRouter.get(
  "/period-data",
  authorization,
  getTransactionsPeriodData
);
transactionsRouter.delete("/", authorization, deleteTransaction);

module.exports = transactionsRouter;
