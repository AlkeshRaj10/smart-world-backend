const mongoose = require("mongoose");

const addMediaSchema = new mongoose.Schema(
  {
    addId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adds",
      required: true,
    },
    mediaType: {
      type: String,
      required: false,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddsMedia = mongoose.model("AddsMedia", addMediaSchema);

module.exports = AddsMedia;
