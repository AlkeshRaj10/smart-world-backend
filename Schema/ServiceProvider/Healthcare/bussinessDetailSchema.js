const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const completeBussinessDetailSchema = z
  .object({
    hospitalName: baseStringSchema("hospitalName"),
    hospitalAddress: baseStringSchema("hospitalAddress"),
    hospitalType: z.enum(["Government", "Private", "NGO"]),
  })
  .strict();

module.exports = completeBussinessDetailSchema;
