const express = require("express");
const {
  register,
  login,
  logout,
  authorization,
  refresh,
} = require("../../controllers/authorization/auth");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authorization, logout);
authRouter.post("/refresh", refresh);
