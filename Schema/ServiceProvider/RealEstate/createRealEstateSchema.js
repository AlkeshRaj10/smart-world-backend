const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const createRealEstateAddSchema = z
  .object({
    title: baseStringSchema("title"),
    description: baseStringSchema("description"),
    propertyType: z.enum([
      "Residential",
      "Commercial",
      "Industrial",
      "Land/Plots",
      "Agricultural",
    ]),
    transactionType: z.enum(["Buy", "Sell", "Rent", "Lease"]),
    //location details
    fullAddress: baseStringSchema("fullAddress"),
    city: baseStringSchema("city"),
    state: baseStringSchema("state"),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    //property specifications
    areaSize: z.coerce.number(),
    unitType: z.enum(["Sqft", "Sqm", "Acre", "Kanal", "Marla"]),
    bedrooms: z.string(),
    bathrooms: z.string(),
    furnishingStatus: z.enum(["Furnished", "Semi-Furnished", "Unfurnished"]),
    totalFloors: z.string(),
    parkingAvailability: z.coerce.boolean(),
  })
  .strict();

module.exports = createRealEstateAddSchema;
