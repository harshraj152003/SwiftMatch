const express = require("express");
const connectDB = require("./config/database");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

// Profile API
app.get("/profile", userAuth, async (req, res) => {
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

// login API
app.post("/login", async (req, res) => {
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
      // Get jwt token from the user schema method getJWT()
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

// Profile API
// app.get("/profile",async (req,res)=>{

//   const cookies = req.cookies;
//   console.log(cookies);
//   res.status(200).send("Reading Cookie");
// })

// Signup API
app.post("/signup", async (req, res) => {
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

// Send Connection request API
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log(user.firstName + " wants to connect you!");
  res.send("Connection request Sent");
});

connectDB()
  .then(() => {
    console.log("Database connection established..");
    app.listen(8888, () => {
      console.log(`Server is listening on localhost:8888`);
    });
  })
  .catch((err) => {
    console.log("Database not connected");
  });
