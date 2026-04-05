const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const createAdvocasyAddSchema = z
  .object({
    caption: baseStringSchema("caption"),
  })
  .strict();

module.exports = createAdvocasyAddSchema;
