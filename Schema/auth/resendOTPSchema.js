const { z } = require("zod");

const resendOTPSchema = z
  .object({
    email: z.string().email(),
    role: z.enum(["SERVICEPROVIDER", "USER"]),
  })
  .strict();

module.exports = resendOTPSchema;
