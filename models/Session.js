const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  uid: { type: ObjectId },
});

module.exports = mongoose.model("Session", sessionSchema);
