const user = require("../model/userModel");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, password, phone } = req.body;

  if (!firstName || !lastName || !password || !phone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingUser = await user.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists." });
    }
    const newUser = new user({ firstName, lastName, password, phone });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." , newUser: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register user." });
  }
});

router.post("/login", async(req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: "Phone and password are required." });
  }

  try {
    const user = await user.findOne({ phone, password });
    if (!user ||!(await user.comparePassword(password))) {
      return res
       .status(401)
       .json({ error: "Invalid phone or password." });
    }
    res.json({ message: "User logged in successfully.", user });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in user." });
  }
})

module.exports = router;
