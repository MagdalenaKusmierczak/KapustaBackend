const mongoose = require("mongoose");
const app = require("./app");

require("dotenv").config();

const PORT = process.env.PORT || 10000;
const URI_DATABASE = process.env.URI_DATABASE;
const connection = mongoose.connect(URI_DATABASE);

const server = async () => {
  try {
    await connection;
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  }
};

server();
