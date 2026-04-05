const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { okResponse } = require("../../utils/responseHandlers");
const cloudinary = require("../../configs/cloudinary.config");
const { BadRequestError } = require("../../utils/customErrors");

const completeBusinessDetails = async (req, res, next) => {
  try {
    const {
      educationType,
      educationInstituteType,
      educationClassesType,
      businessName,
    } = req.body;

    const businessDetails = await BussinessDetail.findOneAndUpdate(
      { userId: req.user._id },
      {
        businessName,
        educationist: {
          educationType,
          educationInstituteType,
          educationClassesType,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isBussinessDetailsCompleted: true,
        businessDetail: businessDetails._id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    okResponse(
      res,
      200,
      { user, businessDetails },
      "Business profile completed successfully"
    );
  } catch (error) {
    console.error("Error in completing business details", error);
    next(error);
  }
};

const createTeacherAdd = async (req, res, next) => {
  try {
    const { details, minQualification, salaryPackage, forClass } = req.body;

    const newAd = await Adds.create({
      userId: req.user._id,
      caption: details,
      category: "Educationist",
      type: "TEACHER_ADD",
      education: {
        teacherVacancy: {
          minQualification,
          salaryPackage,
          forClass,
        },
      },
    });

    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "ads_media" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                })
                .end(file.buffer);
            });

            return {
              addId: newAd._id,
              mediaType: "image",
              mediaUrl: uploadResult.secure_url,
            };
          } catch (uploadError) {
            throw new BadRequestError(
              "Error uploading media: " + uploadError.message
            );
          }
        })
      );

      const savedMedia = await AddsMedia.insertMany(mediaFiles);

      const mediaIds = savedMedia.map((media) => media._id);
      newAd.media = mediaIds;
      await newAd.save();
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { adds: newAd._id } },
      { new: true }
    );

    return okResponse(res, 200, null, "Ad successfully created.");
  } catch (error) {
    console.log("Error in creating Teacher Ad", error);
    next(error);
  }
};

const createAdmissionOpen = async (req, res, next) => {
  try {
    const { admissionDate, totalSeats } = req.body;

    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Educationist",
      type: "ADMISSION_OPEN",
      education: {
        admissionOpen: {
          admissionDate: new Date(admissionDate),
          totalSeats,
        },
      },
    });

    let mediaFiles = [];
    if (req.files && req.files.length > 0) {
      mediaFiles = await Promise.all(
        req.files.map(async (file) => {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "ads_media" }, (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                })
                .end(file.buffer);
            });

            return {
              addId: newAd._id,
              mediaType: "image",
              mediaUrl: uploadResult.secure_url,
            };
          } catch (uploadError) {
            throw new BadRequestError(
              "Error uploading media: " + uploadError.message
            );
          }
        })
      );

      const savedMedia = await AddsMedia.insertMany(mediaFiles);

      const mediaIds = savedMedia.map((media) => media._id);
      newAd.media = mediaIds;
      await newAd.save();
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { adds: newAd._id } },
      { new: true }
    );

    return okResponse(res, 200, null, "Ad successfully created.");
  } catch (error) {
    console.log("Error in creating admission", error);
    next(error);
  }
};

module.exports = {
  completeBusinessDetails,
  createTeacherAdd,
  createAdmissionOpen,
};
