const { z } = require("zod");
const passwordSchema = require("../common/basePasswordSchema");

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema("newPassword"),
    confirmNewPassword: passwordSchema("confirmNewPassword"),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New Password and Confirm New Password must match",
    path: ["confirmNewPassword"],
  });

module.exports = changePasswordSchema;
