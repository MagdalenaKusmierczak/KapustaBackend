const express = require("express");
const {
  register,
  login,
  logout,
  authorization,
  refresh,
} = require("../../controllers/authorization/auth");

const usersRouter = express.Router();

usersRouter.post("/auth/register", register);
usersRouter.post("/auth/login", login);
usersRouter.post("/auth/logout", authorization, logout);
usersRouter.post("/auth/refresh", refresh);

