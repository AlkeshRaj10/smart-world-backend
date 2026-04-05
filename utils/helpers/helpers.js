const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../../configs/config");
const crypto = require("crypto");

module.exports = {
  generateOtp() {
    const now = Date.now().toString();
    return now.slice(-4);
  },
  hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  },
  comparePassword(password, dbPassword) {
    return bcrypt.compareSync(password, dbPassword);
  },
  generateToken(id, role) {
    return jwt.sign({ id, role }, ACCESS_SECRET, { expiresIn: "7d" });
  },
  generateRefreshToken() {
    return crypto.randomBytes(40).toString("hex");
  },
};
