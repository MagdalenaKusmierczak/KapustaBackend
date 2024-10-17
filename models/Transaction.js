const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Amount is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
    _id: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref:
            "User"
    },
});

module.exports = mongoose.model("Transaction", transactionSchema);
