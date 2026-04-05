const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");

const hostelRouter = require("express").Router();
const hostelController = require("../../Controller/Hostel/hostel.controller");
const completeHostelBusinessDetailSchema = require("../../Schema/ServiceProvider/Hostel/completeHostelBusinessDetailSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const upload = require("../../middlewares/multer.middleware");
const createHostelAddSchema = require("../../Schema/ServiceProvider/Hostel/createHostelAddSchema");

hostelRouter.post(
  "/complete-bussiness-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(completeHostelBusinessDetailSchema),
  hostelController.completeHostelBusinessDetails
);

hostelRouter.post(
  "/create-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createHostelAddSchema),
  hostelController.createAdd
);

module.exports = hostelRouter;
