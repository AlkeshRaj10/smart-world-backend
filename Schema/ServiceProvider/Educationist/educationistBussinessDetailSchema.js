const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const educationistBussinessDetailSchema = z
  .object({
    businessName: baseStringSchema("bussinessName"),
    educationType: z.enum(["School", "College", "Tution"]),
    educationInstituteType: z.enum(["Government", "Private", "NGO"]),
    educationClassesType: z.enum(["Primary", "Secondary", "Both"]),
    description: baseStringSchema("description"),
  })
  .strict();

module.exports = educationistBussinessDetailSchema;
