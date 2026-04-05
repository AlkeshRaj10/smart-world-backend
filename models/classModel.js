const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    classCode: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String, 
      required: true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
