const showRoomRouter = require("express").Router();
const showRoomController = require("../../Controller/ShowRoom/showRoomController");
const completeShowRoomBussinessDetails = require("../../Schema/ServiceProvider/ShowRoom/completeBussinessDetailsScehma");
const upload = require("../../middlewares/multer.middleware");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const createShowRoomAddSchema = require("../../Schema/ServiceProvider/ShowRoom/createShowRoomAddSchema");

showRoomRouter.post(
  "/complete-bussiness-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(completeShowRoomBussinessDetails),
  showRoomController.completeBussinessDetails
);

showRoomRouter.post(
  "/create-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createShowRoomAddSchema),
  showRoomController.createShowRoomAdd
);

module.exports = showRoomRouter;
