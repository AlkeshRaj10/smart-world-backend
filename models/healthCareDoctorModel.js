const mongoose = require("mongoose");

const healthCareDoctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctorName: {
      type: String,
      required: true,
    },
    clinicTimings: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    fees: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HealthCareDoctors = mongoose.model(
  "HealthCareDoctor",
  healthCareDoctorSchema
);
module.exports = HealthCareDoctors;
