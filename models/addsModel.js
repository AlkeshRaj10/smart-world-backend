const mongoose = require("mongoose");

const addsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      enum: [
        "Educationist",
        "Healthcare",
        "Advocasy",
        "RealEstate",
        "Showroom",
        "Salon",
        "Hostel",
        "Gym",
      ],
      required: true,
    },
    education: {
      teacherVacancy: {
        minQualification: {
          type: String,
          required: false,
        },
        salaryPackage: {
          type: Number,
          required: false,
        },
        forClass: {
          type: String,
          required: false,
        },
      },
      admissionOpen: {
        admissionDate: {
          type: Date,
          required: false,
        },
        totalSeats: {
          type: Number,
          required: false,
        },
      },
    },
    healthcare: {
      doctorAppointment: {
        doctorName: {
          type: String,
          required: false,
        },
        timings: {
          type: String,
          required: false,
        },
        speciality: {
          type: String,
          required: false,
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
          required: false,
        },
        experience: {
          type: Number,
          required: false,
        },
        education: {
          type: String,
          required: false,
        },
        mbbsYear: {
          type: String,
          required: false,
        },
      },
      labTests: {
        testDescription: {
          type: String,
          required: false,
        },
        sampleRequired: {
          type: String,
          required: false,
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
        urgentFees: {
          type: String,
          required: false,
        },
        normalFees: {
          type: String,
          required: false,
        },
      },
    },
    gym: {
      details: {
        type: String,
        required: false,
      },
    },
    realEstate: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
      propertyType: {
        type: String,
        enum: [
          "Residential",
          "Commercial",
          "Industrial",
          "Land/Plots",
          "Agricultural",
        ],
      },
      transactionType: {
        type: String,
        enum: ["Buy", "Sell", "Rent", "Lease"],
        required: false,
      },
      locationDetails: {
        fullAddress: {
          type: String,
          required: false,
        },
        city: {
          type: String,
          required: false,
        },
        state: {
          type: String,
          required: false,
        },
        latitude: {
          type: Number,
          required: false,
        },
        longitude: {
          type: Number,
          required: false,
        },
      },
      propertySpecifications: {
        areaSize: {
          type: Number,
          required: false,
        },
        unitType: {
          type: String,
          enum: ["Sqft", "Sqm", "Acre", "Kanal", "Marla"],
        },
        bedrooms: {
          type: Number,
          required: false,
        },
        bathrooms: {
          type: Number,
          required: false,
        },
        furnishingStatus: {
          type: String,
          enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
        },
        totalFloors: {
          type: Number,
          required: false,
        },
        parkingAvailability: {
          type: Boolean,
          default: false,
        },
      },
    },
    showRoom: {
      description: {
        type: String,
        required: false,
      },
      vehicleType: {
        type: String,
        enum: ["Car", "Bike", "Truck", "Other"],
      },
      brand: {
        type: String,
        enum: ["Suzuki", "Honda", "Hyundai", "Kia", "Other", "Dewan", "Toyota"],
      },
      model: {
        type: String,
        required: false,
      },
      mileage: {
        type: Number,
        required: false,
      },
      fuelType: {
        type: [String],
        enum: ["Petrol", "Diesel", "Electric"],
      },
      transmission: {
        type: String,
        enum: ["Manual", "Automatic"],
      },
      condition: {
        type: String,
        enum: ["New", "Used"],
      },
      color: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        required: false,
      },
    },
    advocasy: {
      caption: { type: String, required: false },
    },
    hostel: {
      caption: {
        type: String,
        required: false,
      },
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddsMedia",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Adds = mongoose.model("Adds", addsSchema);

module.exports = Adds;
