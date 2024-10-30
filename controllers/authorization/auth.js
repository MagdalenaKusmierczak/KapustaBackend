const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Session = require("../../models/Session");

require("dotenv").config();

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        status: "Conflict",
        code: 409,
        message: "Provided email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, Number(process.env.HASH));

    const newUser = await User.create({
      email,
      password: hashPassword,
      balance: 0,
      transactions: [],
    });

    return res.status(201).json({
      status: "Successful operation",
      code: 201,
      email: newUser.email,
      id: newUser._id,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      status: "Error",
      message: "Bad request (invalid request body)",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email)
      return res.status(400).json({
        status: "ValidationError",
        code: 400,
        message: "Bad request (invalid request body)",
      });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        status: "Unauthorized",
        code: 403,
        message: "Email doesn't exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({
        status: "Unauthorized",
        code: 403,
        message: "Email or password is wrong",
      });
    }

    const setSession = await Session.create({ uid: user._id });

    const accessToken = jwt.sign(
      { uid: user._id, sid: setSession._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      { uid: user._id, sid: setSession._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    return res.status(200).json({
      status: "OK",
      code: 200,
      accessToken,
      refreshToken,
      sid: setSession._id,
      userData: {
        email: user.email,
        balance: user.balance,
        id: user._id,
        transactions: user.transactions,
      },
    });
  } catch (error) {
    return res.status(404).json({
      code: 404,
      status: "Error",
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  const activeSession = req.session;

  try {
    await Session.deleteOne({ _id: activeSession._id });
    return res.status(204).json({
      code: 204,
      status: "ok",
      message: "Successful operation",
    });
  } catch (error) {
    return res.status(404).json({
      code: 404,
      status: "Error",
      message: "Invalid user / Invalid session",
    });
  }
};

const authorization = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader) {
    const accessToken = authHeader.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return res.status(401).json({
        code: 401,
        status: "Error",
        message: "Unauthorized",
      });
    }

    const user = await User.findById(payload.uid);
    const session = await Session.findById(payload.sid);

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "Invalid user",
      });
    }
    if (!session) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "Invalid session",
      });
    }
    req.user = user;
    req.session = session;
    next();
  } else
    return res.status(400).json({
      code: 400,
      status: "Error",
      message: "No token provided",
    });
};

const refresh = async (req, res) => {
  const authHeader = req.get("Authorization");

  if (authHeader) {
    const getSession = await Session.findById(req.body.sid);

    if (!getSession) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "Invalid session",
      });
    }

    const reqRefreshToken = authHeader.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(reqRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      await Session.findByIdAndDelete(req.body.sid);
      return res.status(401).json({
        code: 401,
        status: "Error",
        message: "Unauthorized",
      });
    }

    const user = await User.findById(payload.uid);
    const session = await Session.findById(payload.sid);

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "Invalid user",
      });
    }

    if (!session) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "Invalid session",
      });
    }
    await Session.findByIdAndDelete(payload.sid);

    const setSession = await Session.create({
      uid: user._id,
    });

    const newAccessToken = jwt.sign(
      { uid: user._id, sid: setSession._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
      }
    );

    const newRefreshToken = jwt.sign(
      { uid: user._id, sid: setSession._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    return res.status(200).json({
      code: 200,
      status: "Success",
      newAccessToken,
      newRefreshToken,
      newSid: setSession._id,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  authorization,
  refresh,
};
