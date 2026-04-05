const mongoose = require("mongoose");

const chatParticipantSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatParticipantModel = mongoose.model(
  "ChatParticipant",
  chatParticipantSchema
);
module.exports = ChatParticipantModel;
