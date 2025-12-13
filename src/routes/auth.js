const express = require("express");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = express.Router();

// Signup API
authRouter.post("/signup", async (req, res) => {
  // validation of data
  try {
    validateSignUpData(req);

    // Encrypt the password and then store to DB
    const { password, firstName, lastName, emailId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Creating Instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

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

// login API
authRouter.post("/login", async (req, res) => {
  try {
    // Validate email and password
    validateLoginData(req);

    // Authenticate the user
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).send("LOGIN successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// logout API
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged Out");
});

module.exports = authRouter;
