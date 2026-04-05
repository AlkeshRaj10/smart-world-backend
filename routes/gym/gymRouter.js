const { validateSchema } = require("../../utils/helpers/validateSchema");

const gymRouter = require("express").Router();
const gymController = require("../../Controller/Gym/GymController");
const gymBussinessDetailsSchema = require("../../Schema/ServiceProvider/Gym/completeBussinessDetailsSchema");
const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const createGymAddSchema = require("../../Schema/ServiceProvider/Gym/createGymAddSchema");
const upload = require("../../middlewares/multer.middleware");

gymRouter.post(
  "/complete-business-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(gymBussinessDetailsSchema),
  gymController.completeGymBussinessDetails
);

gymRouter.post(
  "/create-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createGymAddSchema),
  gymController.createGymAdd
);

module.exports = gymRouter;
