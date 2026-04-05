const {
  User,
  OTP,
  Session,
  ForgotPasswordOTP,
  BussinessDetail,
} = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const cloudinary = require("../../configs/cloudinary.config");

const {
  generateOtp,
  hashPassword,
  generateToken,
  generateRefreshToken,
  comparePassword,
} = require("../../utils/helpers/helpers");
const { okResponse } = require("../../utils/responseHandlers");

const signUp = async (req, res, next) => {
  try {
    let { role, email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw new BadRequestError("This email is already registered");
    }

    const otp = generateOtp();
    const dbOTP = await OTP.findOneAndUpdate(
      {
        email,
      },
      {
        otp,
        role,
      },
      {
        upsert: true,
        new: true,
      }
    );
    _scheduleOtpDeletion(dbOTP);
    // have to send otp on email through nodemailer
    return okResponse(
      res,
      200,
      dbOTP.otp,
      "A 4-digit OTP has been sent to your email"
    );
  } catch (error) {
    console.log("Error in signup", error);
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const newOTP = generateOtp();
    const dbOTP = await OTP.findOneAndUpdate(
      {
        email,
        role,
      },
      {
        otp: newOTP,
      },
      {
        upsert: true,
        new: true,
      }
    );

    // Placeholder for nodemailer function to send the OTP email
    // nodemailer()

    _scheduleOtpDeletion(dbOTP);

    return okResponse(
      res,
      200,
      newOTP, // Return newOTP.otp instead of otp
      "A 4-digit OTP has been sent to your email"
    );
  } catch (error) {
    console.log("Error in resend otp", error);
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    let { email, otp, role, password } = req.body;
    const dbOTP = await OTP.findOne({
      email,
      otp,
      role,
    });

    if (!dbOTP) {
      throw new BadRequestError("Invalid OTP, or OTP Expired");
    }
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken();

    const session = await Session.create({
      userId: user.id,
      refreshToken,
      fcmToken: req.body.fcmToken ?? null,
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    });

    return okResponse(
      res,
      200,
      { user, role, refreshToken: session.refreshToken },
      "OTP Verified Successfuly, Now Please Complete Your Profile To Continue",
      token
    );
  } catch (error) {
    console.log("Error in verifying otp", error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await Session.findOneAndDelete({ refreshToken });
    return okResponse(res, 200, null, "Logged Out Successfully");
  } catch (error) {
    next(error);
    console.log("Error in logging out", error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role }).populate("businessDetail");

    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }

    const match = comparePassword(password, user.password);
    if (!match) {
      throw new BadRequestError("Invalid Credentials");
    }

    const accessToken = generateToken(user._id, "USER");
    const refreshToken = generateRefreshToken();

    const session = Session.create({
      refreshToken,
      fcmToken: req.body.fcmToken ?? null,
      userId: user._id,
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    });

    const businessDetails = await BussinessDetail.findOne({
      userId: user._id,
    });

    delete user.password;
    console.log(businessDetails,"businessDetails");
    return okResponse(
      res,
      200,
      { user, category: businessDetails?.category ?? null, refreshToken },
      "Logged In Successfully",
      accessToken
    );
  } catch (error) {
    console.log("Error in log in ", error);
    next(error);
  }
};

const userCompleteProfile = async (req, res, next) => {
  try {
    const { email, role } = req.user;
    const { firstName, lastName, gender, contactNumber, category } = req.body;

    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "profile_pictures" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    const user = await User.findOneAndUpdate(
      {
        email,
      },
      {
        firstName,
        lastName,
        gender,
        contactNumber,
        profilePicture: uploadedImage.secure_url,
        isProfileCompleted: true,
      },
      { new: true }
    );

    let businessDetails = null;
    if (category !== "null") {
      businessDetails = await BussinessDetail.findOneAndUpdate(
        { userId: req.user._id },
        { category },
        { new: true, upsert: true }
      );
    }

    return okResponse(
      res,
      200,
      {
        user,
        role: req.user.role,
        category: businessDetails?.category ?? null,
      },
      "Congratulations! Your Profile Is Completed"
    );
  } catch (error) {
    console.log("Error in completing profile of user", error);
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "profile_pictures" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.file.buffer);
    });
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { profilePicture: uploadedImage.secure_url }
    );

    return okResponse(res, 200, null, "Profile Picture Updated Successfully");
  } catch (error) {
    console.log("Error in updating profile picture", error);
    console.log(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id });
    return okResponse(res, 200, user, "Profile Fetched Successfully");
  } catch (error) {
    console.log("Error in getting profile", error);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, _id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const match = comparePassword(oldPassword, password);
    if (!match) {
      throw new BadRequestError("Invalid Old Password");
    }
    const newPasswordHash = hashPassword(newPassword);

    await User.findOneAndUpdate(
      { _id },
      { password: newPasswordHash },
      { new: true }
    );

    return okResponse(res, 200, null, "Password Changed Successfully");
  } catch (error) {
    console.error("Error in change password:", error);
    next(error);
  }
};

const toggleNotification = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Toggle isNotify based on the current value
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { isNotify: !req.user.isNotify },
      { new: true, select: "isNotify" } // Return the updated value only
    );

    return okResponse(
      res,
      200,
      { isNotify: updatedUser.isNotify },
      "Notification Setting Updated Successfully"
    );
  } catch (error) {
    console.error("Error in toggle notification", error);
    next(error);
  }
};

// const forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!email) {
//     throw new BadRequestError("User Not Found");
//   }
//   const otp = generateOtp();
//   const dbOTP = await ForgotPasswordOTP.findOneAndUpdate(
//     {
//       email,
//     },
//     {
//       otp,
//     },
//     {
//       upsert: true,
//       new: true,
//     }
//   );
//   _scheduleForgotPasswordOTP(dbOTP);
//   return okResponse(
//     res,
//     200,
//     dbOTP.otp,
//     "A 4-digit OTP has been sent to your email"
//   );
// };

// const verifyForgotPassword = async (req, res, next) => {
//   try {
//     const { otp, email } = req.body;
//     const dbOTP = await ForgotPasswordOTP.findOne({ email, otp });
//     if (!dbOTP) {
//       throw new BadRequestError("invalid otp");
//     }
//     return okResponse(
//       res,
//       200,
//       null,
//       "OTP Verified Successfully,Now Change Password"
//     );
//   } catch (error) {
//     console.log("Error in verifying forgot password otp ", error);
//     next(error);
//   }
// };

// const resetPassword = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//   } catch (error) {
//     console.log("Error in resetting password", error);
//     next(error);
//   }
// };

//HELPER PRIVATE FUNCTION
const _scheduleOtpDeletion = (dbOTP) => {
  setTimeout(async () => {
    try {
      await OTP.findOneAndDelete({
        email: dbOTP.email,
        otp: dbOTP.otp,
        role: dbOTP.role,
        otpType: dbOTP.otpType
      });
      console.log("OTP deleted");
    } catch (error) {
      console.error("Error in deletion of OTP:", error);
    }
  }, 60000);
};

const _scheduleForgotPasswordOTP = (dbOTP) => {
  setTimeout(async () => {
    try {
      await ForgotPasswordOTP.findOneAndDelete({
        email: dbOTP.email,
        otp: dbOTP.otp,
      });
      console.log("Forgot Password OTP deleted");
    } catch (error) {
      console.error("Error in deletion of OTP:", error);
    }
  }, 60000);
};

const getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const data = await User.findById(_id).populate({ path: "businessDetail", model: "BusinessDetail" });
    return okResponse(res, 200, data, "User Details Fetched Successfully");

  }
  catch (error) {
    console.log("Error in getting me", error);
    next(error);
  }
}

//send forgotpassword otp
const forgotPasswordOtp = async (req, res, next) => {
  try {
    const { role, email } = req.body;
    const user = await User.findOne({ email, role });
    if (!user) {
      throw new BadRequestError("Invalid Email");
    }
    const otp = generateOtp();
    const dbOTP = await OTP.findOneAndUpdate(
      {
        email,
      },
      {
        otp,
        role,
        otpType: "FORGOT_PASSWORD"
      },
      {
        upsert: true,
        new: true,
      }
    );
    _scheduleOtpDeletion(dbOTP);
    //TODO: Send Email
    return okResponse(res, 200, dbOTP.otp, "An Reset Password OTP has been sent to your email");
  }
  catch (error) {
    console.log("Error in sending forgot password otp", error);
    next(error);
  }
}

//verify forgot password otp
const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const { otp, role, email } = req.body;
    const dbOtp = await OTP.findOne({
      otp,
      role,
      email,
    })

    if (!dbOtp) {
      throw new BadRequestError("Invalid OTP");
    }

    //otp found
    await OTP.findByIdAndDelete(dbOtp._id);
    return okResponse(res, 200, null, "OTP Verified Successfully,Now Please Change Password");
  }
  catch (error) {
    console.log("Error in verifying forgot password otp", error);
    next(error);
  }
}

//reset password after verifying otp
const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  return okResponse(res, 200, null, "Password Changed Successfully");
}

module.exports = {
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  signUp,
  resendOTP,
  login,
  verifyOTP,
  userCompleteProfile,
  logout,
  updateProfilePicture,
  getProfile,
  changePassword,
  toggleNotification,
  getMe
};
