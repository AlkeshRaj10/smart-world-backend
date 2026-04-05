const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");

const createGymAddSchema = z
  .object({
    details: baseStringSchema("details"),
  })
  .strict();

module.exports = createGymAddSchema;
