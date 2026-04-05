const app = require("./app");
const { PORT } = require("./configs/config");
const connectDB = require("./configs/db.config");
const http = require("http");
const connectSocket = require("./Socket");

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server is running at PORT ${PORT}`);
    });

    connectSocket(server);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1);
  }
};

startServer();
