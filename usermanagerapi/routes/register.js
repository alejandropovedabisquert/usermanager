var express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
var router = express.Router();

router.post("/", async function (req, res) {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    const userExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });

    const result = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: result._id,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

module.exports = router;
