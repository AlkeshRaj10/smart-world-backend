const { z } = require("zod");

const passwordSchema = (field) =>
  z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
    });

module.exports = passwordSchema;
