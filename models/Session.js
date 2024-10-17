const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  uid: { type: String },
  sid: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Session", sessionSchema);
