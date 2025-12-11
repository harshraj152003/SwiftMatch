const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

// Send Connection request API
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log(user.firstName + " wants to connect you!");
  res.send("Connection request Sent");
});

module.exports = requestRouter;