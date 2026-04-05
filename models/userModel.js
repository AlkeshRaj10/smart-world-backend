const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      default: null,
    },
    lastName: {
      type: String,
      required: false,
      default: null,
    },
    profilePicture: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: String,
      enum: ["USER", "SERVICEPROVIDER"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: false,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: false,
    },
    isNotify: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    // Relations
    businessDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessDetail",
    },
    isBussinessDetailsCompleted: {
      type: Boolean,
      default: false,
    },
    adds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Adds",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
