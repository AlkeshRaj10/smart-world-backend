const { ChatMessageModel, ChatModel } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { okResponse } = require("../../utils/responseHandlers");

const loadPreviousMessages = async (req, res, next) => {
  try {
    const { chatId } = req.query;

    if (!chatId) {
      throw new BadRequestError("Chat Id is required");
    }

    const messages = await ChatMessageModel.find({ chatId })
      .sort({ createdAt: -1 })
      .populate({
        path: "sender",
        select: "_id firstName lastName profilePicture",
      });

    return okResponse(
      res,
      200,
      messages,
      "Previous messages fetched successfully"
    );
  } catch (error) {
    console.error("Error in loading previous messages", error);
    next(error);
  }
};

const ChatList = async (req, res, next) => {
  try {
    const chats = await ChatModel.find({
      participants: req.user._id,
    }).populate({
      path: "participants",
      select: "_id firstName lastName profilePicture",
    });

    if (!chats.length) {
      return res.status(200).json({ chats: [] });
    }

    let map = new Map();
    let chatIds = [];

    chats.forEach((chat) => {
      chatIds.push(chat._id);
      map.set(chat._id.toString(), chat.participants);
    });

    const lastMessagesRaw = await ChatMessageModel.aggregate([
      {
        $match: {
          chatId: { $in: chatIds },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$chatId",
          message: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          sender: { $first: "$sender" },
        },
      },
    ]);

    // Populate sender info
    const lastMessages = await ChatMessageModel.populate(lastMessagesRaw, {
      path: "sender",
      model: "User",
      select: "_id firstName lastName profilePicture",
    });

    const response = lastMessages.map((msg) => {
      const chatId = msg._id.toString();
      const participants = map.get(chatId);
      const otherParticipant = participants.find(
        (p) => p._id.toString() !== req.user._id.toString()
      );

      return {
        chatId,
        otherParticipant,
        message: msg.message || "No Message Yet",
        createdAt: msg.createdAt,
        sender: msg.sender,
      };
    });

    return okResponse(res, 200, response, "Chat List Fetched Successfully");
  } catch (error) {
    console.log("Error in getting chat list", error);
    next(error);
  }
};

module.exports = {
  loadPreviousMessages,
  ChatList,
};
