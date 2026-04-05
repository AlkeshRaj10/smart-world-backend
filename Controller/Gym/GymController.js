const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { okResponse } = require("../../utils/responseHandlers");
const cloudinary = require("../../configs/cloudinary.config");

const completeGymBussinessDetails = async (req, res, next) => {
  try {
    const { gymName, isTrainerAvailable, gymFacilities } = req.body;
    const businessDetails = await BussinessDetail.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        gym: {
          gymFacilities,
          trainerAvailable: isTrainerAvailable,
          gymName,
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
        businessDetail:businessDetails._id
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
    console.log("Error in completing gym bussiness details", error);
    next(error);
  }
};

const createGymAdd = async (req, res, next) => {
  try {
    const { details } = req.body;

    if (!details || !req.files?.length) {
      throw new BadRequestError("Atleast Details or One Add Image Is Required");
    }

    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Gym",
      gym: {
        details,
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

      return okResponse(res, 200, newAd, "Ad successfully created.");
    }
  } catch (error) {
    console.log("Error in creating gym add", error);
    next(error);
  }
};

module.exports = {
  completeGymBussinessDetails,
  createGymAdd,
};
