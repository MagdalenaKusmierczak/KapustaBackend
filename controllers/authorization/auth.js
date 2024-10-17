const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const Session = require("../../models/Session");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        status: "Conflict",
        code: 409,
        message: "Provided email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, process.env.HASH);

    const newUser = await User.create({
      email,
      password: hashPassword,
      balance: 0,
      transactions: [],
    });

    return res.json({
      status: "Successful operation",
      code: 201,
      email: newUser.email,
      id: newUser._id,
    });
  } catch (error) {
    res.json({
      code: 400,
      status: "Error",
      message: "Bad request (invalid request body)",
    });
  }
};

const login = async (req, res, next) => {
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
      return res.json({
        status: "Unauthorized",
        code: 403,
        message: "Email doesn't exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.json({
        status: "Unauthorized",
        code: 403,
        message: "Email or password is wrong",
      });
    }

    const setSession = await Session.create({ uid: user._id });

    const accessToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
    );

    const refreshToken = jwt.sign(
      { uid: user._id, sid: newSession._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME }
    );

    return res.json({
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
    res.json({
      code: 404,
      status: "Error",
      message: error.message,
    });
  }
};

// const logout = async (req, res) => {
//   const { _id } = req.user;
//   try {
//     await User.findByIdAndUpdate(_id, { token: null });
//     return res.json({
//       status: "No Content",
//       code: 204,
//     });
//   } catch (error) {
//     res.json({
//       code: 404,
//       status: "Error",
//       message: error.message,
//     });
//   }
// };

// const current = async (req, res) => {
//   try {
//     const { id } = req.user;
//     const user = await User.findById(id);

//     return res.json({
//       code: 200,
//       status: "OK",
//       email: user.email,
//       subscription: user.subscription,
//     });
//   } catch (err) {
//     res.json({
//       status: "Error",
//       body: {
//         message: err.message,
//       },
//     });
//   }
// };

// const changeSubscription = async (req, res, next) => {
//   const { subscription } = req.body;
//   const { id } = req.user;
//   if (Object.keys(req.body).length === 0) {
//     next(
//       res.json({
//         code: 400,
//         status: "missing required",
//         message: "missing required field",
//       })
//     );
//   }
//   const result = await User.findByIdAndUpdate(
//     id,
//     { subscription },
//     { new: true }
//   );
//   if (!result) {
//     return res.json({
//       code: 404,
//       status: "Not found",
//       message: "User not found",
//     });
//   }

//   return res.json({
//     code: 200,
//     status: "OK",
//     subscription,
//   });
// };

module.exports = {
  register,
  login,
  //   logout,
  //   current,
  //   changeSubscription,
};
