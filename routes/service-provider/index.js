const { handleError } = require("../../utils/responseHandlers");
const bussinessDetailsRouter = require("./bussiness-details.router");
const addsRouter = require("./feed.router");

const serviceProviderRootRouter = require("express").Router();

serviceProviderRootRouter.use("/bussiness", bussinessDetailsRouter);
serviceProviderRootRouter.use("/adds", addsRouter);
serviceProviderRootRouter.route("*", (req, res, next) => {
  return handleError(res, 404, null, "Route Not Found");
});

module.exports = serviceProviderRootRouter;
