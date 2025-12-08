const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating Instance of the User Model
  try {
    const user = new User(req.body);
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
app.delete("/user",async (req,res)=>{
  const userId = req.body.userId;

  try{
    const user = await User.findByIdAndDelete(userId);
    res.status(201).send("User Deleted Successfully , Name: "+user.firstName);
  }
  catch(err){
    res.status(404).send("User not found by given Id");
  }
})

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
app.patch("/user",async (req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try{
    await User.findByIdAndUpdate({_id: userId}, data);
    res.status(201).send("User's Data Updated Successfully");
  }
  catch(err){
    res.status(404).send("User not found by given ID");
  }
})

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
