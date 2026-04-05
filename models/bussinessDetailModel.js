const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema(
  {
    start: { type: String, required: false },
    end: { type: String, required: false },
  },
  { _id: false }
);

const DayAvailabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    slots: [SlotSchema],
  },
  { _id: false }
);

const bussinessDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: false,
    },

    businessAdress: {
      type: String,
      required: false,
      default: null,
    },

    //bio
    description: {
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
    },

    //for education
    educationist: {
      educationType: {
        type: String,
        enum: ["School", "College", "Tution"],
        required: false,
      },
      educationInstituteType: {
        type: String,
        enum: ["Government", "Private", "NGO"],
        required: false,
      },
      educationClassesType: {
        type: String,
        enum: ["Primary", "Secondary", "Both"],
        required: false,
      },
    },
    //for healthcare
    healthcare: {
      hospitalName: {
        type: String,
        required: false,
      },
      hospitalAddress: {
        type: String,
        required: false,
      },
      hospitalType: {
        type: String,
        enum: ["Government", "Private", "NGO"],
      },
    },

    advocasy: {
      consultationFee: {
        type: Number,
      },
      experienceYears: { type: Number },
      barCouncil: {
        type: String,
      },
      categories: {
        type: [String],
        enum: [
          "Criminal Law",
          "Family Law",
          "Corporate Law",
          "Civil Law",
          "Tax Law",
          "Immigration Law",
          "Labour & Employment Law",
          "Property & Real Estate",
          "Constitutional Law",
          "Intellectual Property Law",
          "Consumer Protection Law",
          "Banking & Finance Law",
          "Cyber Law",
          "Environmental Law",
          "Insurance Law",
          "Contract Law",
          "Human Rights Law",
          "Education Law",
          "Medical Malpractice",
        ],
      },
      fee: {
        type: Number,
        required: false,
      },
      availability: [DayAvailabilitySchema],
    },

    gym: {
      gymName: {
        type: String,
        required: false,
      },
      trainerAvailable: {
        type: Boolean,
        required: false,
      },
      gymFacilities: {
        type: [String],
        enum: [
          "Cardio Equipment",
          "Strength Training Equipment",
          "Personal Training",
          "Group Fitness Classes",
          "Sauna/Steam Room",
          "Swimming Pool",
          "Locker Rooms with Showers",
          "Changing Rooms",
          "Cafeteria/Health Bar",
          "Parking Facility",
          "Kids Play Area/Daycare",
          "Indoor Sports Area",
          "Spa and Massage Services",
          "24/7 Access",
          "Wi-Fi Access",
        ],
      },
    },

    realEstate: {
      ownerType: {
        type: String,
        enum: ["Owner", "Broker", "Builder"],
      },
      servicesOffered: {
        type: [String],
        enum: [
          "Buy",
          "Sell",
          "Rent",
          "Lease",
          "Property Management",
          "Real Estate Consultancy",
        ],
      },
      propertyTypesDealt: {
        type: [String],
        enum: [
          "Residential",
          "Commercial",
          "Industrial",
          "Land/Plots",
          "Agricultural",
        ],
      },
    },

    showRoom: {
      ownerName: {
        type: String,
        required: false,
      },
      yearsOfExperience: {
        type: Number,
        required: false,
      },
      openingDays: {
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
        required: false,
      },
      brandsAvailable: {
        type: [String],
        enum: ["Honda", "Suzuki", "Hyundai", "Toyota", "Kia", "Changan"],
        required: false,
      },
      vehicleTypes: {
        type: [String],
        enum: ["Car", "Truck", "Bike", "Others"],
        required: false,
      },
    },

    hostel: {
      hostelName: {
        type: String,
        required: false,
      },
      genderType: {
        type: String,
        enum: ["Male", "Female", "Co Ed"],
      },
      totalRooms: {
        type: Number,
        required: false,
      },
      //Single,Double,Shared
      roomTypes: [
        {
          type: String,
          required: false,
        },
      ],
      //WiFi, Mess, Laundry, AC, Security, Parking
      services: [
        {
          type: String,
          required: false,
        },
      ],
    },

    businessLiscense: {
      type: String,
      required: false,
      default: null,
    },
    averageRating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BussinessDetail = mongoose.model("BusinessDetail", bussinessDetailSchema);

module.exports = BussinessDetail;
