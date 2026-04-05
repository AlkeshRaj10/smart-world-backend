const { z } = require("zod");
const baseStringSchema = require("../common/baseStringSchema");

const userCompleteProfileSchema = z
  .object({
    category: z.string(),
    firstName: baseStringSchema("firstName"),
    lastName: baseStringSchema("lastName"),
    gender: z.enum(["male", "female", "others"]),
    contactNumber: baseStringSchema("contactNumber"),
  })
  .strict();

module.exports = userCompleteProfileSchema;
