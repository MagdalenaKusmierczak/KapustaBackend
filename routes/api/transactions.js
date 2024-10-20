const express = require("express");

const transactionsRouter = express.Router();

transactionsRouter.post("/income");
transactionsRouter.get("/income");
transactionsRouter.get("/income-categories");
transactionsRouter.post("/expense");
transactionsRouter.get("/expense");
transactionsRouter.get("/expense-categories");
transactionsRouter.get("/period-data");
transactionsRouter.delete("/");

module.exports = transactionsRouter;
