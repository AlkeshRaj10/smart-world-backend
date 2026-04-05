const { handleError } = require("../../utils/responseHandlers");
const webAuthRouter = require("./auth.router");
const webEducationistRouter = require("./web.educationist.router");
const webHealthCareDoctorRouter = require("./web.healthcare.router");

const webRouter = require("express").Router();

webRouter.use("/auth", webAuthRouter);
webRouter.use("/educationist", webEducationistRouter);
webRouter.use("/health-care", webHealthCareDoctorRouter);
webRouter.route("*", (req, res, next) => {
  handleError(res, 404, null, "route not found");
});

module.exports = webRouter;
