const { z } = require("zod");
const baseStringSchema = require("../../common/baseStringSchema");
const passwordSchema = require("../../common/basePasswordSchema");

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Please enter valid email address" }),
    role: z.enum(["SERVICEPROVIDER", "USER"]),
}).strict();

const verifyForgotPasswordSchema = z.object({
    otp: baseStringSchema("otp"),
    email: z.string().email({ message: "Please enter valid email address" }),
    role: z.enum(["SERVICEPROVIDER", "USER"]),
}).strict();

const resetPassword = z.object({
    email:baseStringSchema("email"),
    password: passwordSchema("newPassword"),
    confirmNewPassword: passwordSchema("confirmNewPassword"),
}).strict().refine((data) => data.password === data.confirmNewPassword, {
    message: "New Password and Confirm New Password must match",
    path: ["confirmNewPassword"],
});;

module.exports = {
    forgotPasswordSchema,
    verifyForgotPasswordSchema,
    resetPassword
}