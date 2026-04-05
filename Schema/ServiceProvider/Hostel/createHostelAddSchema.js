const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const createHostelAddSchema = z
  .object({
    caption: baseStringSchema("caption"),
  })
  .strict();

module.exports = createHostelAddSchema;
