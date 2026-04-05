const realEstateRouter = require("express").Router();
const realEstateController = require("../../Controller/RealEstate/realEstateController");
const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const realEstateBussinessDetailSchema = require("../../Schema/ServiceProvider/RealEstate/completeBussinessDetailsSchema");
const createRealEstateAddSchema = require("../../Schema/ServiceProvider/RealEstate/createRealEstateSchema");
const upload = require("../../middlewares/multer.middleware");

realEstateRouter.post(
  "/complete-business-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(realEstateBussinessDetailSchema),
  realEstateController.completeBussinessDetails
);

realEstateRouter.post(
  "/create-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createRealEstateAddSchema),
  realEstateController.createRealEstateAdd
);

module.exports = realEstateRouter;
