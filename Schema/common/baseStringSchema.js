const { z } = require("zod");

const baseStringSchema = (field) =>
  z
    .string({ message: `${field} is required` })
    .trim()
    .min(1, { message: `${field} cannot be left empty` })
    .max(190, { message: `${field} cannot exceed 190 characters` });

module.exports = baseStringSchema;
