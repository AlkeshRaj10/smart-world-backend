const { ACCESS_SECRET } = require("../configs/config");
const { User } = require("../models");
const { UnauthorizedError, BadRequestError } = require("../utils/customErrors");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyServiceProvider: async (req, res, next) => {
    try {
    } catch (error) {
      console.log("Error in verifying service provider token", error);
      next(error);
    }
  },

  verifyUser: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Please login to continue");
      }

      const token = authHeader.split(" ")[1];
      const data = jwt.verify(token, ACCESS_SECRET);

      const user = await User.findOne({ _id: data.id });
      if (!user) {
        throw new UnauthorizedError("Please login to continue");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError("Session expired, please login again"));
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError("Invalid token, please login to continue"));
      } else {
        next(error);
      }
    }
  },

  user_type_check: (USERTYPE) => {
    return (req, res, next) => {
      try {
        const role = req.user.role; // Assuming `req.user` is set in earlier middleware
        if (USERTYPE !== role) {
          throw new BadRequestError(
            `This route can only be accessed by ${USERTYPE}`
          );
        }
        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        next(error); // Pass the error to the error-handling middleware
      }
    };
  },
};
