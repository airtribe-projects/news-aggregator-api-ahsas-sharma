const server = require("./app");
const mongoose = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME;
const DB_CONNECTION = process.env.DB_CONNECTION;

mongoose
  .connect(DB_CONNECTION + DB_NAME)
  .then(() => {
    console.log(`MongoDB connected | Database: ${DB_NAME}`);
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
  });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
