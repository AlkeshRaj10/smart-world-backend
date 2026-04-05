const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { okResponse } = require("../../utils/responseHandlers");
const cloudinary = require("../../configs/cloudinary.config");

const completeBusinessDetails = async (req, res, next) => {
  try {
    const { hospitalName, hospitalAddress, hospitalType } = req.body;

    const businessDetails = await BussinessDetail.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        healthcare: {
          hospitalName,
          hospitalAddress,
          hospitalType,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    const user = await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        isBussinessDetailsCompleted: true,
        businessDetail: businessDetails._id,
      },
      {
        new: true,
      }
    );

    okResponse(
      res,
      200,
      { user, businessDetails },
      "Business Details Added Successfully"
    );
  } catch (error) {
    console.log("Error in completing business details", error);
    next(error);
  }
};

const createDoctorAppointments = async (req, res, next) => {
  try {
    let {
      doctorName,
      timings,
      speciality,
      days,
      fees,
      experience,
      education,
      mbbsYear,
    } = req.body;

    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Healthcare",
      type: "DOCTOR_APPOINTMENT",
      healthcare: {
        doctorAppointment: {
          doctorName,
          timings,
          speciality,
          days: days.split(","),
          fees,
          experience,
          education,
          mbbsYear,
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

    return okResponse(res, 200, newAd, "Ad successfully created.");
  } catch (error) {
    console.log("Error in creating doctor appointments", error);
    next(error);
  }
};

const createLabTest = async (req, res, next) => {
  try {
    const { testDescription, sampleRequired, urgentFees, normalFees } =
      req.body;
    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Healthcare",
      type: "LAB_TEST",
      healthcare: {
        labTests: {
          testDescription,
          urgentFees,
          normalFees,
          sampleRequired,
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

    return okResponse(res, 200, newAd, "Ad successfully created.");
  } catch (error) {
    console.log("Error in creating lab test", error);
    next(error);
  }
};

module.exports = {
  completeBusinessDetails,
  createDoctorAppointments,
  createLabTest,
};
