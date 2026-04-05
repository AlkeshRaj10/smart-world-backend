const loginSchema = require("../../Schema/common/loginSchema");
const { validateSchema } = require("../../utils/helpers/validateSchema");
const webAuthController = require("../../Controller/Web/web.auth.controller");
const webAuthRouter = require("express").Router();

webAuthRouter.post("/login",validateSchema(loginSchema),webAuthController.login)


module.exports = webAuthRouter;