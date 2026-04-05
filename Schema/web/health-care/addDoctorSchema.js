const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const baseNumberSchema = require("../../common/baseNumberSchema");

const addDoctorSchema = z.object({
  doctorName: baseStringSchema("doctorName"),
  clinicTimings: baseStringSchema("clinicTimings"),
  category: baseStringSchema("category"),
  fees: baseNumberSchema("fees"),
  days: z.array(
    z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
  ),
});

module.exports = addDoctorSchema;
