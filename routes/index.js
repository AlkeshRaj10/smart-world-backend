const { handleError } = require("../utils/responseHandlers");
const advocasyRouter = require("./advocasy/advocasyRouter");
const authRouter = require("./auth/auth.router");
const chatRouter = require("./chat/chatRouter");
const educationistRouter = require("./educationist/educationistRouter");
const gymRouter = require("./gym/gymRouter");
const healthCareRouter = require("./health-care/healthcareRouter");
const hostelRouter = require("./Hostel/hostel.router");
const realEstateRouter = require("./realEstate/realEstateRouter");
const serviceProviderRootRouter = require("./service-provider");
const showRoomRouter = require("./showroom/showRoomRouter");
const userRootRouter = require("./user");
const webRouter = require("./web");

const rootRouter = require("express").Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/service-provider", serviceProviderRootRouter);
rootRouter.use("/user", userRootRouter);
rootRouter.use("/educationist", educationistRouter);
rootRouter.use("/health-care", healthCareRouter);
rootRouter.use("/gym", gymRouter);
rootRouter.use("/real-estate", realEstateRouter);
rootRouter.use("/show-room", showRoomRouter);
rootRouter.use("/advocasy", advocasyRouter);
rootRouter.use("/hostel", hostelRouter);
rootRouter.use("/chat", chatRouter);
rootRouter.use("/web", webRouter);

rootRouter.use("*", (req, res, next) => {
  return handleError(res, 404, null, "Route Not Found");
});
module.exports = rootRouter;
