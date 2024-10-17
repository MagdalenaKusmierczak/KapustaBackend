const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  _id: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Transaction", transactionSchema);
