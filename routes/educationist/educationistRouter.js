const educationistRouter = require("express").Router();
const educationistController = require("../../Controller/Educationist/educationistController");
const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/multer.middleware");
const createTeacherAddSchema = require("../../Schema/ServiceProvider/Educationist/createTeacherAddSchema");
const educationistBussinessDetailSchema = require("../../Schema/ServiceProvider/Educationist/educationistBussinessDetailSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");

educationistRouter.post(
  "/complete-profile",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(educationistBussinessDetailSchema),
  educationistController.completeBusinessDetails
);

educationistRouter.post(
  "/teacher-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createTeacherAddSchema),
  educationistController.createTeacherAdd
);

educationistRouter.post(
  "/admission-open",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  educationistController.createAdmissionOpen
);
module.exports = educationistRouter;
