const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res, next) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@gmail.com",
    password: "harsh@123",
  };

  try {
    const user = new User(userObj);
    await user.save();
    res.status(201).send("User Added Successfully");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(7777, () => {
      console.log(`Server is listening on localhost:7777`);
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
