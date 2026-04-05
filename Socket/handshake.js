const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../configs/config");
const { User } = require("../models");

const authenticate = async (socket) => {
  try {
    const authHeader = socket.handshake.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];
    const data = jwt.verify(token, ACCESS_SECRET);

    const user = await User.findById(data.id);
    if (!user) {
      throw new Error("Unauthorized");
    }

    socket.user = user;
  } catch (error) {
    socket.emit("error", { message: "Token invalid or expired" });
    socket.disconnect();
  }
};

module.exports = authenticate;
