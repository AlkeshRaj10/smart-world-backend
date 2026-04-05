const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");

const bussinessDetailsRouter = require("express").Router();
const serviceProviderContoller = require("../../Controller/ServiceProvider/serviceProvider.controller");
const upload = require("../../middlewares/multer.middleware");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const uploadBussinessDetailsSchema = require("../../Schema/ServiceProvider/uploadBussinessDetailsSchema");

bussinessDetailsRouter.post(
  "/",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.single("bussinessLiscense"),
  validateSchema(uploadBussinessDetailsSchema),
  serviceProviderContoller.uploadBussinessDetails
);

bussinessDetailsRouter.get(
  "/",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  serviceProviderContoller.getBussinessDetails
);

module.exports = bussinessDetailsRouter;
