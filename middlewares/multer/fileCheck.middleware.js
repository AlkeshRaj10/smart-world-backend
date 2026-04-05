const { ValidationError } = require("../../utils/customErrors");

const isFileExists = (message, multiple = false) => {
  return (req, res, next) => {
    try {
      if (multiple) {
        if (!req.files || Object.keys(req.files).length === 0) {
          throw new ValidationError(message);
        }
      } else {
        if (!req.file) {
          throw new ValidationError(message);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = isFileExists;
