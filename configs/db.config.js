const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { DATABASE_URL } = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb://asndev99:NwVahNSN77cEou29@ac-rzzev7n-shard-00-00.055namv.mongodb.net:27017,ac-rzzev7n-shard-00-01.055namv.mongodb.net:27017,ac-rzzev7n-shard-00-02.055namv.mongodb.net:27017/SmartWorld?ssl=true&replicaSet=atlas-yruwjw-shard-0&authSource=admin&retryWrites=true&w=majority&appName=asndevcluster", {
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
