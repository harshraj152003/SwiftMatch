const express = require("express");
const connectDB = require("./config/database");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();

app.use(express.json());

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
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

// Delete a user from db using _id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.status(201).send("User Deleted Successfully , Name: " + user.firstName);
  } catch (err) {
    res.status(404).send("User not found by given Id");
  }
});

// Get User by email.
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) res.status(404).send("User not found");
    else res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// feed API - GET /feed - get all the users from DB
app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({});
    if (users.length === 0) res.status(404).send("User not found");
    else res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Update data in the db
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "gender",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (data?.skills.length > 5) {
      throw new Error("Can't add more than 5 skills");
    }

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(201).send("User's Data Updated Successfully");
  } catch (err) {
    res.status(404).send("UPDATE FAILED : " + err.message);
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
