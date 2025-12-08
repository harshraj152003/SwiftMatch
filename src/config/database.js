const mongoose = require("mongoose");

const connectDB = async () => {
  const db = await mongoose.connect(
    "mongodb+srv://harshraj152003:Ashadevi13@cluster0.4qimpzc.mongodb.net/DevTinder"
  );
};

module.exports = connectDB;