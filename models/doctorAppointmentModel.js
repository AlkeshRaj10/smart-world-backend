const mongoose = require("mongoose");

const doctorAppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthCareDoctor",
    },
    appointmentId: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DoctorAppointments = mongoose.model(
  "DoctorAppointment",
  doctorAppointmentSchema
);
module.exports = DoctorAppointments;
