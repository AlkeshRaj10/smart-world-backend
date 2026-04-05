const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const feedController = require("../../Controller/ServiceProvider/service-provider.adds.controller");
const upload = require("../../middlewares/multer.middleware");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const createAddSchema = require("../../Schema/ServiceProvider/Adds/createAddSchema");
const isFileExists = require("../../middlewares/multer/fileCheck.middleware");

const addsRouter = require("express").Router();

addsRouter.post(
  "/",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  isFileExists("Atleast Upload One Image for Your Add", true),
  validateSchema(createAddSchema),
  feedController.createAdd
);

addsRouter.get(
  "/",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  feedController.fetchAdds
);

module.exports = addsRouter;
