const {
  verifyUser,
  user_type_check,
} = require("../../middlewares/auth.middleware");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const webEducationistController = require("../../Controller/Web/web.educationist.controller");
const addMemberSchema = require("../../Schema/web/common/addMemberSchema");
const createClassSchema = require("../../Schema/web/createClassSchema");
const addMemberToClassSchema = require("../../Schema/web/addMemberToClassSchema");
const webEducationistRouter = require("express").Router();

webEducationistRouter.post(
  "/add-member",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(addMemberSchema),
  webEducationistController.addMembers
);

webEducationistRouter.get(
  "/fetch-members-to-add",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  webEducationistController.getMembersToAdd
);

webEducationistRouter.get(
  "/view-my-members",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  webEducationistController.viewMyMembers
);

webEducationistRouter.post(
  "/create-class",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(createClassSchema),
  webEducationistController.createClass
);

webEducationistRouter.get(
  "/get-my-classes",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  webEducationistController.getMyClasses
);

webEducationistRouter.post(
  "/add-member-to-class",
  verifyUser,
  user_type_check("SERVICEPROVIDER"),
  validateSchema(addMemberToClassSchema),
  webEducationistController.addMemberToClass
);


module.exports = webEducationistRouter;
