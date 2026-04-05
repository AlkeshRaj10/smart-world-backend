const express = require("express");
const { reqLogger } = require("./configs/logger.config");
const rootRouter = require("./routes");
const globalErrorMiddleware = require("./middlewares/globalErrorMiddleware");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(reqLogger);
app.use(cors({origin:"*"}));
app.get("/api/v1/health-check", (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: "Server is running",
  });
});
app.use("/api/v1", rootRouter);
app.use(globalErrorMiddleware);

module.exports = app;
