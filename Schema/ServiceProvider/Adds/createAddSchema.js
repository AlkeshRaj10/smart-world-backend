const { z } = require("zod");

const createAddSchema = z
  .object({
    caption: z.string().nullable().optional(),
  })
  .strict();

module.exports = createAddSchema;
