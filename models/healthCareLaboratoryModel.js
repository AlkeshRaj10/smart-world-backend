const mongoose = require("mongoose");

const healthCareLaboratoryTestsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    testName: {
      type: String,
      required: true,
    },
    testFees: {
      type: Number,
      required: true,
    },
    testCode: {
      type: String,
      required: true,
    },
    sampleRequired: {
      type: String,
      enum: [
        "Blood",
        "Urine",
        "Saliva",
        "Stool",
        "Sputum",
        "Swab",
        "Skin Scraping",
        "Tissue",
        "Cerebrospinal Fluid",
        "Amniotic Fluid",
        "Hair",
        "Nail Clipping",
        "Sweat",
        "Breath",
        "Semen",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LabTestResult",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HealthCareLaboratoryTests = mongoose.model(
  "HealthCareLaboratoryTest",
  healthCareLaboratoryTestsSchema
);
module.exports = HealthCareLaboratoryTests;
