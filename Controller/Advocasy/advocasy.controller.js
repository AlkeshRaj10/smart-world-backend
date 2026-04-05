const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const cloudinary = require("../../configs/cloudinary.config");
const { okResponse } = require("../../utils/responseHandlers");

const completeAdvocasyBusinessDetail = async (req, res, next) => {
  try {
    const {
      consultationFee,
      experienceYears,
      barCouncil,
      categories,
      availability,
    } = req.body;

    const businessDetails = await BussinessDetail.findOneAndUpdate(
      { userId: req.user._id },
      {
        advocasy: {
          consultationFee,
          experienceYears,
          barCouncil,
          categories,
          availability,
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

    return okResponse(
      res,
      200,
      { user, businessDetails },
      "Business Details Added Successfully"
    );
  } catch (error) {
    console.log("Error in completing bussiness detail", error);
    next(error);
  }
};

const createAdvocasyAdd = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Advocasy",
      type: "ADVOCASY_ADD",
      advocasy: {
        caption,
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

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { adds: newAd._id } },
        { new: true }
      );
      return okResponse(res, 200, null, "Ad successfully created.");
    }
  } catch (error) {
    console.log("Error in creating advocasy add", error);
    next(error);
  }
};

module.exports = {
  completeAdvocasyBusinessDetail,
  createAdvocasyAdd,
};
