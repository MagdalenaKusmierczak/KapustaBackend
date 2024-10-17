const express = require("express");
const {
  register,
  login,
//   logout,
} = require("../../controllers/authorization/auth");

const usersRouter = express.Router();

usersRouter.post("/auth/register", register);
usersRouter.post("/auth/login", login);
// usersRouter.post("/auth/logout", auth, logout);
// usersRouter.post("/auth/refresh", auth, refresh);




// router.post("/logout", async (req, res) => {
//   try {
//     if (!req.session.userId) {
//       return res.status(404).json({ error: "Invalid user / Invalid session" });
//     }

//     delete req.session.userId;

//     res.status(204).send();
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
