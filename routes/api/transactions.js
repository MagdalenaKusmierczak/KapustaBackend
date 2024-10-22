const express = require("express");
const { authorization } = require("../../controllers/authorization/auth");
const {
  addIncome,
  getIncome,
  getIncomeCategorized,
  addExpense,
  getExpense,
  getExpenseCategorized,
  getTransactionsPeriodData,
  deleteTransaction,
} = require("../../controllers/transactions/transactions");

const transactionsRouter = express.Router();

transactionsRouter.post("/income", authorization, addIncome);
transactionsRouter.get("/income"), authorization, getIncome;
transactionsRouter.get(
  "/income-categories",
  authorization,
  getIncomeCategorized
);
transactionsRouter.post("/expense", authorization, addExpense);
transactionsRouter.get("/expense", authorization, getExpense);
transactionsRouter.get(
  "/expense-categories",
  authorization,
  getExpenseCategorized
);
transactionsRouter.get(
  "/period-data",
  authorization,
  getTransactionsPeriodData
);
transactionsRouter.delete("/", authorization, deleteTransaction);

module.exports = transactionsRouter;
