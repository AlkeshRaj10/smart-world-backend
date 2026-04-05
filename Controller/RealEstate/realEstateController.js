const { BussinessDetail, User, Adds, AddsMedia } = require("../../models");
const { okResponse } = require("../../utils/responseHandlers");
const cloudinary = require("../../configs/cloudinary.config");
const { BadRequestError } = require("../../utils/customErrors");

const completeBussinessDetails = async (req, res, next) => {
  try {
    const { servicesOffered, propertyTypesDealt, ownerType } = req.body;

    const businessDetails = await BussinessDetail.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        realEstate: {
          ownerType,
          servicesOffered,
          propertyTypesDealt,
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

const createRealEstateAdd = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      transactionType,
      fullAddress,
      city,
      state,
      areaSize,
      unitType,
      bedrooms,
      bathrooms,
      furnishingStatus,
      totalFloors,
      parkingAvailability,
      latitude,
      longitude,
    } = req.body;

    const propertySpecs = {
      areaSize: parseFloat(areaSize),
      unitType,
      furnishingStatus,
      parkingAvailability: JSON.parse(parkingAvailability),
    };

    if (bedrooms && !isNaN(Number(bedrooms))) {
      propertySpecs.bedrooms = Number(bedrooms);
    }

    if (bathrooms && !isNaN(Number(bathrooms))) {
      propertySpecs.bathrooms = Number(bathrooms);
    }

    if (totalFloors && !isNaN(Number(totalFloors))) {
      propertySpecs.totalFloors = Number(totalFloors);
    }

    const newAd = await Adds.create({
      userId: req.user._id,
      category: "RealEstate",
      realEstate: {
        title,
        description,
        propertyType,
        transactionType,
        locationDetails: {
          fullAddress,
          city,
          state,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
        propertySpecifications: propertySpecs,
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

    return res.status(201).json({
      success: true,
      message: "Real estate ad created successfully",
      data: newAd,
    });
  } catch (error) {
    console.log("Error in creating real estate add", error);
    next(error);
  }
};

module.exports = {
  completeBussinessDetails,
  createRealEstateAdd,
};
