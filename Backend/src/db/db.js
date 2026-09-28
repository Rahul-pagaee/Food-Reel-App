

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODb_URL);
    console.log("Database was connected");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
  }
};

module.exports = connectDB;