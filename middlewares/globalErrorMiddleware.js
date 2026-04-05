const { handleError } = require("../utils/responseHandlers");

const globalErrorMiddleware = (err, req, res, next) => {
  const status = err.status ?? 500;
  const message = err.message ?? "Something went wrong";
  handleError(res, status, null, message);
};

module.exports = globalErrorMiddleware;
