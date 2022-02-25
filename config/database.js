const mongoose = require("mongoose");
require("dotenv").config();
const connectDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
  } catch (error) {
    throw error;
  }
};

module.exports = connectDataBase;
