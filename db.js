const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/IntershipWork");
    console.log("Database connection established");
  } catch (error) {
    console.error("Connection error: " + error.message);
  }
};

module.exports = { databaseConnection };
