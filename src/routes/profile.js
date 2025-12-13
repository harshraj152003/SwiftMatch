const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData , validatePasswordEdit } = require("../utils/validation");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

// Profile/view API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    console.error("Profile fetching error: ", error);
    res.status(500).send({
      message: "Errorr : ",
      error: error.message,
    });
  }
});

// Profile/edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    // Loop through all the coming request fields
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, Your Profile Updated Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

// Profile/forgotpassword API
profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    
    const loggedInUser = req.user;

    if (!validatePasswordEdit(req , req.body.password)) {
      throw new Error("Invalid password edit request. Password does not meet criteria.");
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, Your Password Updated Successfully.`,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
}); 

module.exports = profileRouter;
