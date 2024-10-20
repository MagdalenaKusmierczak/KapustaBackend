const express = require("express");
const {authorization} = require("../../controllers/authorization/auth");
const { getUserData, updateBalance } = require("../../controllers/users/users");

const usersRouter = express.Router();

usersRouter.get("/", authorization, getUserData);
usersRouter.patch("/balance", authorization, updateBalance);

module.exports = usersRouter;
