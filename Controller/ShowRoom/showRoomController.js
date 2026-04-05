const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { okResponse } = require("../../utils/responseHandlers");
const cloudinary = require("../../configs/cloudinary.config");

const completeBussinessDetails = async (req, res, next) => {
  try {
    const {
      ownerName,
      yearsOfExperience,
      openingDays,
      brandsAvailable,
      vehicleTypes,
    } = req.body;

    const businessDetails = await BussinessDetail.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        showRoom: {
          ownerName,
          yearsOfExperience: Number(yearsOfExperience),
          openingDays,
          brandsAvailable,
          vehicleTypes,
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
        businessDetail: businessDetails._id,
        isBussinessDetailsCompleted: true,
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
    console.log("Error in completing bussiness details", error);
    next(error);
  }
};

const createShowRoomAdd = async (req, res, next) => {
  try {
    const newAd = await Adds.create({
      userId: req.user._id,
      category: "Showroom",
      showRoom: {
        ...req.body,
        price: parseFloat(req.body.price),
        mileage: parseFloat(req.body.mileage),
        fuelType: JSON.parse(req.body.fuelType),
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
  completeBussinessDetails,
  createShowRoomAdd,
};
