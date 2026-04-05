const { z } = require("zod");
const { categoryConstants } = require("../../utils/constants/globalConstants");
const baseStringSchema = require("../common/baseStringSchema");

const uploadBussinessDetailsSchema = z
  .object({
    businessName: baseStringSchema("bussinessName"),
    businessAdress: z.string().optional().nullable(),
    description: baseStringSchema("description"),
    category: z.enum(Object.keys(categoryConstants)),
  })
  .strict();

module.exports = uploadBussinessDetailsSchema;
