const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from req cookies
    const { token } = req.cookies;
    if(!token){
      throw new Error("Token is not VALID");
    }

    // Validate the token
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const { _id } = decodedObj;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    
    // Attach user and token to req object
    req.user = user; 
    // req.token = token;
    
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
