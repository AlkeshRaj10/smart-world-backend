const { verifyUser } = require("../../middlewares/auth.middleware");
const { handleError } = require("../../utils/responseHandlers");
const userPublicFeedRouter = require("./user.public-feed.router");
const userRootRouter = require("express").Router();

userRootRouter.use("/public-feed", userPublicFeedRouter);
userRootRouter.route("*", (req, res, next) => {
  return handleError(res, 404, null, "Route Not Found");
});

module.exports = userRootRouter;
