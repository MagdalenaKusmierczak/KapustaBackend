const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [{ type: mongoose.Schema.ObjectId, ref: "Transaction" }],
  session: { type: mongoose.Schema.ObjectId, ref: "Session" },
});

module.exports = mongoose.model("User", userSchema);
