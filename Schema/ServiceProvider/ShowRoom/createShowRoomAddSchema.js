const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const createShowRoomAddSchema = z
  .object({
    description: baseStringSchema("description"),
    vehicleType: z.enum(["Car", "Bike", "Truck", "Other"]),
    brand: z.enum([
      "Suzuki",
      "Honda",
      "Hyundai",
      "Kia",
      "Other",
      "Dewan",
      "Toyota",
    ]),
    model: baseStringSchema("model"),
    mileage: z.coerce.number(),

    fuelType: z
      .string()
      .transform((val) => {
        try {
          const parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) {
            throw new Error();
          }
          return parsed;
        } catch (error) {
          throw new Error("fuelType must be an array");
        }
      })
      .refine(
        (arr) =>
          arr.every((item) => ["Petrol", "Diesel", "Electric"].includes(item)),
        {
          message: "Invalid fuel type provided",
        }
      ),

    transmission: z.enum(["Manual", "Automatic"]),
    condition: z.enum(["New", "Used"]),
    color: baseStringSchema("color"),
    price: z.coerce.number(),
  })
  .strict();

module.exports = createShowRoomAddSchema;
