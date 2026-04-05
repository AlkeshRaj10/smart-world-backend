const { BussinessDetail, User } = require("../../models");
const cloudinary = require("../../configs/cloudinary.config");
const { okResponse } = require("../../utils/responseHandlers");
const { categoryConstants } = require("../../utils/constants/globalConstants");

const uploadBussinessDetails = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let bussinessLiscenseImage = null;

    if (req.file) {
      bussinessLiscenseImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "profile_pictures" }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          })
          .end(req.file.buffer);
      });
    }

    const { businessName, businessAdress, description, category } = req.body;

    const updatedBusinessDetails = await BussinessDetail.findOneAndUpdate(
      { userId: _id },
      {
        businessName,
        businessAdress: businessAdress || null,
        description,
        category: categoryConstants[category],
        businessLiscense: bussinessLiscenseImage || null,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const user = await User.findOneAndUpdate(
      { _id },
      {
        isBussinessDetailsCompleted: true,
        businessDetail: updatedBusinessDetails._id,
      },
      { new: true }
    ).populate({ path: "businessDetail", model: "BusinessDetail" });

    return okResponse(
      res,
      200,
      user.toObject(),
      "Bussiness Details Saved Successfully"
    );
  } catch (error) {
    console.log("Error", error);
    next(error);
  }
};

const getBussinessDetails = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const data = await BussinessDetail.findOne({ userId: _id });
    return okResponse(res, 200, data, "Bussiness Details Fetched Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBussinessDetails,
  uploadBussinessDetails,
};
