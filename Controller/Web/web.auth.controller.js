const { User, Session, BussinessDetail } = require("../../models");
const { BadRequestError } = require("../../utils/customErrors");
const { comparePassword, generateRefreshToken, generateToken } = require("../../utils/helpers/helpers");
const { okResponse } = require("../../utils/responseHandlers");

const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) {
      throw new BadRequestError("Invalid Credentials");
    }

    const currentRole = await BussinessDetail.findOne({ userId: user._id });

    
    const match = comparePassword(password, user.password);
    if (!match) {
      throw new BadRequestError("Invalid Credentials");
    }
    if (!["Educationist", "Healthcare"].includes(currentRole.category)) {
      throw BadRequestError(
        "Only Educationist and Healthcare are allowed to use this admin panel"
      );
    }
    const accessToken = generateToken(user._id, "USER");
    const refreshToken = generateRefreshToken();

    const session = Session.create({
      refreshToken,
      fcmToken: req.body.fcmToken ?? null,
      userId: user._id,
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    });

    delete user.password;
    return okResponse(
      res,
      200,
      { user, refreshToken, role: currentRole.category },
      "Logged In Successfully",
      accessToken
    );
  } catch (error) {
    console.log(error,"error")
    next(error);
  }
};

module.exports = {
  login,
};
