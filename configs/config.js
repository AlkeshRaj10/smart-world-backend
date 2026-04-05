require("dotenv").config();

module.exports = {
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
