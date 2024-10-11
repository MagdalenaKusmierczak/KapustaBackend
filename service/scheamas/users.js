const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        token: {
            type: String,
            default: null,
        }
    },
    { versionKey: false, timestamps: true }
);

const User = mongoose.model('users', user);

module.exports = User; 