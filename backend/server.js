require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedAdmin = require("./utils/seedAdmin");

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
  });
};

startServer();