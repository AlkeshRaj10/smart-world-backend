const { z } = require("zod");

const logoutSchema = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

module.exports = logoutSchema;
