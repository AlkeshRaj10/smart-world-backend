const mongoose = require("mongoose");

const labTestResultSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthCareLaboratoryTest",
    },
    patientName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    resultImage: { type: String, required: false },
    // testDate: { type: Date, required: true },
    patientAge: { type: Number, required: false },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false,
    },
    comments: { type: String, required: false },
    reportIssuedDate: { type: Date, required: false },
    testCost: { type: Number, required: false },
    isUrgent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LabTestResult = mongoose.model("LabTestResult", labTestResultSchema);
module.exports = LabTestResult;
