const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const db = await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;