const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const createAdvocasyBusinessDetailSchema = require("../../Schema/ServiceProvider/Advocasy/createAdvocasyBusinessDetailSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const advocasyController = require("../../Controller/Advocasy/advocasy.controller");
const createAdvocasyAddSchema = require("../../Schema/ServiceProvider/Advocasy/createAdvocasyAddSchema");
const upload = require("../../middlewares/multer.middleware");

const advocasyRouter = require("express").Router();

advocasyRouter.post(
  "/complete-bussiness-details",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(createAdvocasyBusinessDetailSchema),
  advocasyController.completeAdvocasyBusinessDetail
);

advocasyRouter.post(
  "/create-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  upload.array("AddMedia"),
  validateSchema(createAdvocasyAddSchema),
  advocasyController.createAdvocasyAdd
);

module.exports = advocasyRouter;
