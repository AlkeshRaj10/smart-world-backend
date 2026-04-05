const mongoose = require("mongoose");

const sessionModel = new mongoose.Schema({
  userId: {
    type: String,
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  refreshToken: {
    type: String,
    required: true,
  },
  fcmToken: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const Sessions = mongoose.model("Sessions", sessionModel);
module.exports = Sessions;
