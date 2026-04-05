const { z } = require("zod");

const realEstateBusinessDetailSchema = z
  .object({
    ownerType: z.enum(["Owner", "Broker", "Builder"]),
    servicesOffered: z.array(
      z.enum([
        "Buy",
        "Sell",
        "Rent",
        "Lease",
        "Property Management",
        "Real Estate Consultancy",
      ])
    ),
    propertyTypesDealt: z.array(
      z.enum([
        "Residential",
        "Commercial",
        "Industrial",
        "Land/Plots",
        "Agricultural",
      ])
    ),
  })
  .strict();

module.exports = realEstateBusinessDetailSchema;
