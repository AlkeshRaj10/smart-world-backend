const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");

const userPublicFeedRouter = require("express").Router();
const publicFeedController = require("../../Controller/User/user.public-feed.controller");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const rateServiceProviderSchema = require("../../Schema/ServiceProvider/rateBusinessDetailSchema");

userPublicFeedRouter.get(
  "/",
  verifyUser,
  user_type_check("USER"),
  publicFeedController.getFeeds
);

userPublicFeedRouter.get(
  "/details/:id",
  verifyUser,
  user_type_check("USER"),
  publicFeedController.getAddDetail
);

userPublicFeedRouter.get(
  "/view-service-provider-profile/:id",
  // verifyUser,
  // user_type_check("USER"),
  publicFeedController.viewServiceProviderFeed
);

userPublicFeedRouter.post(
  "/submit-rating",
  verifyUser,
  validateSchema(rateServiceProviderSchema),
  publicFeedController.rateServiceProvider
);

userPublicFeedRouter.get(
  "/service-provider/ratings",
  verifyUser,
  publicFeedController.viewServiceProviderRatings
)

userPublicFeedRouter.get(
  "/by-username/:username",
  verifyUser,
  user_type_check("USER"),
  publicFeedController.getFeedsByUsername
);

module.exports = userPublicFeedRouter;
