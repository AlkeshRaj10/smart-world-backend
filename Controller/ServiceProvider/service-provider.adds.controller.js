const { BadRequestError } = require("../../utils/customErrors");
const { okResponse } = require("../../utils/responseHandlers");
const { Adds, AddsMedia, BussinessDetail, User } = require("../../models/index");
const cloudinary = require("../../configs/cloudinary.config");

const createAdd = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Check if the user has uploaded business details
    const bussinessDetails = await BussinessDetail.findOne({ userId: _id });
    if (!bussinessDetails) {
      throw new BadRequestError("Please upload your business details first.");
    }

    // Create the new ad
    const newAd = await Adds.create({
      userId: _id,
      caption: req.body.caption || null,
      category: bussinessDetails.category, // Ensures category consistency
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
              mediaType: "image", // Assuming image type; handle other types if needed
              mediaUrl: uploadResult.secure_url,
            };
          } catch (uploadError) {
            throw new BadRequestError(
              "Error uploading media: " + uploadError.message
            );
          }
        })
      );

      // Save the media to the database
      const savedMedia = await AddsMedia.insertMany(mediaFiles);

      // Update the ad with media references
      const mediaIds = savedMedia.map((media) => media._id);
      newAd.media = mediaIds;
      await newAd.save();
    }

    // Add the new ad's ID to the user's adds array
    await User.findByIdAndUpdate(
      _id,
      { $push: { adds: newAd._id } },
      { new: true }
    );

    return okResponse(res, 200, null, "Add successfully created.");
  } catch (error) {
    console.error("Error in creating ad:", error);
    next(error);
  }
};

const fetchAdds = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const userAdds = await Adds.find({ userId: _id }).populate({
      path: "media",
      model: "AddsMedia",
      select: "mediaUrl mediaType _id",
    });

    // Return the list of ads
    return okResponse(res, 200, userAdds, "All Adds Fetched Successfully");
  } catch (error) {
    console.error("Error in fetching service provider adds", error);
    next(error);
  }
};

module.exports = {
  fetchAdds,
  createAdd,
};
