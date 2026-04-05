const { z } = require("zod");

const baseNumberSchema = (field) =>
  z.coerce
    .number({ message: `${field} must be a number` })
    .min(1, { message: `${field} must be at least 1` });

module.exports = baseNumberSchema;
