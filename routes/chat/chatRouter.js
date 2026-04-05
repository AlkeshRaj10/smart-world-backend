const chatRouter = require("express").Router();
const chatController = require("../../Controller/Chat/Chat.controller");
const { verifyUser } = require("../../middlewares/auth.middleware");

chatRouter.get(
  "/room-messages",
  verifyUser,
  chatController.loadPreviousMessages
);

chatRouter.get("/list", verifyUser, chatController.ChatList);

module.exports = chatRouter;
