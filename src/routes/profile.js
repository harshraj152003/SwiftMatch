const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

// Profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
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

module.exports = profileRouter;