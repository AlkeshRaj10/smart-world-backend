const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const addDoctorSchema = require("../../Schema/web/health-care/addDoctorSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const healthCareController = require("../../Controller/Web/web.healthcare.controller");
const addLaboratoryTestSchema = require("../../Schema/web/health-care/addLaboratoryTestSchema");
const labTestResultSchema = require("../../Schema/web/health-care/labTestResultSchema");
const webHealthCareDoctorRouter = require("express").Router();

webHealthCareDoctorRouter.get(
  "/",
  verifyUser,
  healthCareController.getAllDoctors
);

webHealthCareDoctorRouter.post(
  "/create-doctor",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(addDoctorSchema),
  healthCareController.addDoctor
);

webHealthCareDoctorRouter.post(
  "/create-laboratory-test",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(addLaboratoryTestSchema),
  healthCareController.createLaboratoryTest
);

webHealthCareDoctorRouter.get(
  "/lab-test",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  healthCareController.getAllLaboratoryTest
);

webHealthCareDoctorRouter.post(
  "/submit-lab-report",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(labTestResultSchema),
  healthCareController.submitTestReport
);

webHealthCareDoctorRouter.get(
  "/lab-reports",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  healthCareController.getLabReports
);
module.exports = webHealthCareDoctorRouter;
