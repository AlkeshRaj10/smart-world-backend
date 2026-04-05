const { z } = require("zod");
const passwordSchema = require("../common/basePasswordSchema");

const verifyOTPSchema = z
  .object({
    role: z.enum(["USER", "SERVICEPROVIDER"]),
    otp: z
      .string()
      .length(4, "OTP must be exactly 4 digits")
      .regex(/^\d{4}$/, "OTP must contain only numbers"),
    email: z.string().email({ message: "Please enter valid email address" }),
    password: passwordSchema("password"),
    confirmPassword: passwordSchema("confirmPassword"),
    fcmToken: z.string().nullable().optional(),
  })
  .strict();

module.exports = verifyOTPSchema;
