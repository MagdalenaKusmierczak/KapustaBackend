const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const income = new Schema(
    {
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
        },
    },
    { versionKey: false, timestamps: true }
);

const Income = mongoose.model('incomes', income);

module.exports = Income; 