const { z } = require("zod");

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  role: z.enum(["USER", "SERVICEPROVIDER"]),
});

module.exports = loginSchema;
