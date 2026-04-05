const healthCareRouter = require("express").Router();
const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const healthCareController = require("../../Controller/Health-care/healthcareController");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const completeBussinessDetailSchema = require("../../Schema/ServiceProvider/Healthcare/bussinessDetailSchema");
const upload = require("../../middlewares/multer.middleware");
const isFileExists = require("../../middlewares/multer/fileCheck.middleware");

healthCareRouter.post(
  "/complete-business-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(completeBussinessDetailSchema),
  healthCareController.completeBusinessDetails
);

healthCareRouter.post(
  "/doctor-appointment",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  isFileExists("Atleast Upload One Image for Your Add", true),
  healthCareController.createDoctorAppointments
);

healthCareRouter.post(
  "/lab-test",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  isFileExists("Atleast Upload One Image for Your Add", true),
  healthCareController.createLabTest
);

module.exports = healthCareRouter;
