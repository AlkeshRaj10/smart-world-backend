const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const completeShowRoomBussinessDetails = z
  .object({
    ownerName: baseStringSchema("ownerName"),
    yearsOfExperience: z.coerce.number().min(1),
    openingDays: z.array(
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
    brandsAvailable: z.array(
      z.enum(["Honda", "Suzuki", "Hyundai", "Toyota", "Kia", "Changan"])
    ),
    vehicleTypes: z.array(z.enum(["Car", "Truck", "Bike", "Others"])),
  })
  .strict();

module.exports = completeShowRoomBussinessDetails;
