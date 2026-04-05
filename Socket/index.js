const { Server } = require("socket.io");
const authenticate = require("./handshake");
const {
  ChatModel,
  ChatMessageModel,
  ChatParticipantsModel,
} = require("../models");
const { BadRequestError } = require("../utils/customErrors");

const connectSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    await authenticate(socket);

    if (!socket.user) return;

    console.log(
      `🟢 New client connected: ${socket.id} (User: ${socket.user.firstName})`
    );

    socket.join(`chat_list_${socket.user._id}`);

    socket.on("join-room", async (data) => {
      try {
        const { userId } = data;
        const loggedInUserId = socket.user._id;

        if (!userId) {
          return socket.emit("error", { message: "userId is required" });
        }

        let chat = await ChatModel.findOne({
          isGroup: false,
          participants: {
            $all: [userId, loggedInUserId],
            $size: 2,
          },
        });

        if (!chat) {
          chat = await ChatModel.create({
            isGroup: false,
            participants: [userId, loggedInUserId],
          });

          await ChatParticipantsModel.create([
            {
              chatId: chat._id,
              userId: loggedInUserId,
            },
            {
              chatId: chat._id,
              userId: userId,
            },
          ]);
        }

        socket.join(chat._id.toString());
        socket.emit("joined-room", { chatId: chat._id });
      } catch (error) {
        console.error("Error in join-room:", error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("send-message", async (data) => {
      try {
        const { chatId, message } = data;
        console.log(chatId, message, "send message payload");
        if (!chatId || !message) {
          throw new BadRequestError("chatId and message are required");
        }

        const newMessage = await ChatMessageModel.create({
          chatId,
          message,
          sender: socket.user._id,
        });

        const populatedMessage = await ChatMessageModel.findById(
          newMessage._id
        ).populate({
          path: "sender",
          select: "_id firstName lastName profilePicture",
        });

        io.to(chatId).emit("new-message", { newMessage: populatedMessage });
        socket
          .to(`chat_list_${socket.user._id}`)
          .emit("chat-list", { newMessage });
      } catch (error) {
        console.error("Error in sending message", error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(
        `🔴 ${socket.user.firstName} Client disconnected: ${socket.id}`
      );
    });
  });

  return io;
};

module.exports = connectSocket;
