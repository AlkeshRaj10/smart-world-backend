const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000),
      index: { expires: "1m" },
    },
  },
  { timestamps: true }
);

const ForgotPasswordOTP = mongoose.model(
  "ForgotPasswordOTP",
  forgotPasswordSchema
);
module.exports = ForgotPasswordOTP;
