const { okResponse } = require("../../utils/responseHandlers");
const { Adds, User, RatingModel, BussinessDetail } = require("../../models/index");
const { BadRequestError } = require("../../utils/customErrors");

const getFeeds = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = {};

    if (category !== undefined) {
      if (
        ![
          "Educationist",
          "Healthcare",
          "Advocasy",
          "RealEstate",
          "Showroom",
          "Salon",
          "Hostel",
          "Gym",
        ].includes(category)
      ) {
        throw new BadRequestError("Invalid Category");
      }
      query.category = category;
    }

    const posts = await Adds.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture",
      })
      .populate({
        path: "media",
        model: "AddsMedia",
        select: "mediaUrl mediaType _id",
      });

    return okResponse(res, 200, posts, "Posts Fetched Successfully");
  } catch (error) {
    console.log("Error in get feeds", error);
    next(error);
  }
};

const getAddDetail = async (req, res, next) => {
  try {
    const posts = await Adds.findById(req.params.id)
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture",
      })
      .populate({
        path: "media",
        model: "AddsMedia",
        select: "mediaUrl mediaType _id",
      });

    return okResponse(res, 200, posts, "Posts Fetched Successfully");
  } catch (error) {
    console.log("Error in getting add details");
    next(error);
  }
};

const viewServiceProviderFeed = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ _id: id })
      .populate({
        path: "businessDetail",
        model: "BusinessDetail",
        select: "category _id averageRating",
      })
      .populate({
        path: "adds",
        model: "Adds",
        populate: {
          path: "media",
          model: "AddsMedia",
          select: "mediaUrl mediaType _id",
        },
      });

    return okResponse(
      res,
      200,
      { data },
      "Service Provider Feed Fetched Successfully"
    );
  } catch (error) {
    console.error("Error in viewing service provider feed", error);
    next(error);
  }
};

const viewServiceProviderRatings = async (req, res, next) => {
  try {
    const { businessId } = req.query;

    if (!businessId) {
      throw new BadRequestError("businessId is required to view ratings");
    }

    const ratings = await RatingModel.find({ business: businessId })
      .populate({
        path: "givenBy",
        model: "User",
        select: "firstName lastName profilePicture"
      })

    return okResponse(res, 200, ratings, "Service Provider Ratings Fetched Successfully");
  }
  catch (error) {
    console.log("Error in viewing service provider rating", error);
    next(error);
  }
}

const rateServiceProvider = async (req, res, next) => {
  try {
    const { businessId, review, rating } = req.body;
    const newRating = await RatingModel.create({
      business: businessId,
      review,
      rating: parseFloat(rating),
      givenBy: req.user._id
    })

    const avgRatings = await RatingModel.aggregate([
      { $match: { business: newRating.business } },
      {
        $group: {
          _id: "$business",
          avgRating: { $avg: "$rating" },
        }
      }
    ]);

    if (avgRatings.length > 0) {
      await BussinessDetail.findByIdAndUpdate(businessId, {
        averageRating: avgRatings[0].avgRating,
      });
    }
    return okResponse(res, 200, null, "Rating Submitted Successfully");
  }
  catch (error) {
    console.log("Error in rating service provider", error);
    next(error);
  }
}

const getFeedsByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username) {
      throw new BadRequestError("Username is required");
    }

    const posts = await Adds.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "firstName lastName profilePicture",
        match: {
          $or: [
            { firstName: { $regex: username, $options: "i" } },
            { lastName: { $regex: username, $options: "i" } }
          ]
        }
      })
      .populate({
        path: "media",
        model: "AddsMedia",
        select: "mediaUrl mediaType _id",
      })
      .then(posts => posts.filter(post => post.userId !== null));

    return okResponse(res, 200, posts, "Posts Fetched Successfully");
  } catch (error) {
    console.log("Error in get feeds by username", error);
    next(error);
  }
};

module.exports = {
  getFeeds,
  viewServiceProviderFeed,
  getAddDetail,
  rateServiceProvider,
  viewServiceProviderRatings,
  getFeedsByUsername
};
