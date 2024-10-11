const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expense = new Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const Expense = mongoose.model("expenses", expense);

module.exports = Expense;
