const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const gymBussinessDetailsSchema = z
  .object({
    gymName: baseStringSchema("gymName"),
    isTrainerAvailable: z.boolean(),
    gymFacilities: z.array(
      z.enum([
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
      ])
    ),
  })
  .strict();

module.exports = gymBussinessDetailsSchema;
