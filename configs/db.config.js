const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { DATABASE_URL } = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const modelsPath = path.join(__dirname, "../models");
    fs.readdirSync(modelsPath).forEach((file) => {
      if (file !== "index.js") {
        require(path.join(modelsPath, file));
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
