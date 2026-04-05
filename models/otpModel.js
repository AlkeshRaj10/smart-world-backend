const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
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
    role: {
      type: String,
      enum: ["USER", "SERVICEPROVIDER"],
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000),
      index: { expires: "1m" },
    },
    otpType:{
      type:String,
      enum:["SIGNUP","FORGOT_PASSWORD"],
      default:"SIGNUP"
    }
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
