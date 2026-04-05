const authRouter = require("express").Router();
const authController = require("../../Controller/Auth/auth.controller");
const { verifyUser } = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/multer.middleware");
const isFileExists = require("../../middlewares/multer/fileCheck.middleware");
const changePasswordSchema = require("../../Schema/auth/changePasswordSchema");
const { forgotPasswordSchema, verifyForgotPasswordSchema, resetPassword } = require("../../Schema/auth/forgotPassword");
const logoutSchema = require("../../Schema/auth/logoutSchema");
const resendOTPSchema = require("../../Schema/auth/resendOTPSchema");
const signupSchema = require("../../Schema/auth/signupSchema");
const userCompleteProfileSchema = require("../../Schema/auth/userCompleteProfileSchema");
const verifyOTPSchema = require("../../Schema/auth/verifyOTPSchema");
const loginSchema = require("../../Schema/common/loginSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");

authRouter.post("/signup", validateSchema(signupSchema), authController.signUp);
authRouter.post("/login", validateSchema(loginSchema), authController.login);

authRouter.post(
  "/resend-otp",
  validateSchema(resendOTPSchema),
  authController.resendOTP
);

authRouter.post(
  "/verify-otp",
  validateSchema(verifyOTPSchema),
  authController.verifyOTP
);

authRouter.post(
  "/logout",
  verifyUser,
  validateSchema(logoutSchema),
  authController.logout
);

authRouter.post(
  "/user-complete-profile",
  verifyUser,
  upload.single("userProfilePicture"),
  isFileExists("Profile Picture is required"),
  validateSchema(userCompleteProfileSchema),
  authController.userCompleteProfile
);

authRouter.patch(
  "/profile-picture",
  verifyUser,
  upload.single("userProfilePicture"),
  isFileExists("New Profile Picture is required"),
  authController.updateProfilePicture
);

authRouter.get("/profile", verifyUser, authController.getProfile);

authRouter.patch(
  "/change-password",
  verifyUser,
  validateSchema(changePasswordSchema),
  authController.changePassword
);

authRouter.patch(
  "/toggle-notifications",
  verifyUser,
  authController.toggleNotification
);

authRouter.get(
  "/get-me",
  verifyUser,
  authController.getMe
);

authRouter.post("/forgot-password-otp",
  validateSchema(forgotPasswordSchema),
  authController.forgotPasswordOtp
);

authRouter.post("/verify-forgot-password-otp",
  validateSchema(verifyForgotPasswordSchema),
  authController.verifyForgotPasswordOtp
);

authRouter.post("/reset-password",
  validateSchema(resetPassword),
  authController.resetPassword
);

module.exports = authRouter;
