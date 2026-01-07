var express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET + "_refresh";

// GET / - Obtain all users
router.get("/", async function (req, res) {
  try {
    let results = await User.find({}).select("-password");

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// POST /login - Login user
router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["username", "password"]
      });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    if (!token || !refreshToken) {
      return res.status(498).json({ message: "Token generation failed" });
    }
    res.json({message: "Login successful", token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// GET /myaccount - Obtain authenticated user's account info
router.get("/myaccount", verifyToken, async function (req, res) {
  try {
    // Verify that the user exists in the database (may have been deleted)
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// POST /register - Register new user
router.post("/register", async function (req, res) {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["username", "password", "email", "firstName", "lastName"]
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        message: "Username must be at least 3 characters long" 
      });
    }

    const userExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    
    if (userExists) {
      const field = userExists.username === username ? "username" : "email";
      return res.status(409).json({ 
        message: `The ${field} is already in use` 
      });
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
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error",
        field: Object.keys(error.keyPattern)[0],
      });
    }
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// POST / - Create new user (admin only)
router.post("/", verifyToken, async function (req, res) {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Forbidden: Only administrators can create users" 
      });
    }

    const { username, password, email, firstName, lastName } = req.body;
    
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["username", "password", "email", "firstName", "lastName"]
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        message: "Username must be at least 3 characters long" 
      });
    }

    // Check for existing username or email
    const userExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    
    if (userExists) {
      const field = userExists.username === username ? "username" : "email";
      return res.status(409).json({ 
        message: `The ${field} is already in use` 
      });
    }

    if (req.body.role && !["user", "admin"].includes(req.body.role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be 'user' or 'admin'" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      role: req.body.role || "user",
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    const result = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: result._id,
    });
    
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error",
        field: Object.keys(error.keyPattern)[0],
      });
    }
    res.status(500).json({ 
      message: "Server error", 
      details: error.message 
    });
  }
});

// GET /:id - Obtain user by ID
router.get("/:id", verifyToken, async function (req, res) {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// PUT /:id - Update user by ID
router.put("/:id", verifyToken, async function (req, res) {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }


    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        message: "Forbidden: You can only update your own profile" 
      });
    }

    if (req.body.role && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Forbidden: Only administrators can change user roles" 
      });
    }

    if (req.body.role && !["user", "admin"].includes(req.body.role)) {
      return res.status(400).json({ 
        message: "Invalid role. Must be 'user' or 'admin'" 
      });
    }

    if (req.body.isActive !== undefined && req.user.role !== "admin") {
      return res.status(403).json({ 
        message: "Forbidden: Only administrators can change user active status" 
      });
    }

    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ 
          message: "Invalid email format" 
        });
      }

      const emailExists = await User.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      if (emailExists) {
        return res.status(409).json({ 
          message: "Email is already in use by another user" 
        });
      }
    }

    if (req.body.username) {
      if (req.body.username.length < 3) {
        return res.status(400).json({ 
          message: "Username must be at least 3 characters long" 
        });
      }

      const usernameExists = await User.findOne({ 
        username: req.body.username,
        _id: { $ne: req.params.id }
      });
      if (usernameExists) {
        return res.status(409).json({ 
          message: "Username is already in use by another user" 
        });
      }
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ 
          message: "Password must be at least 6 characters long" 
        });
      }
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    req.body.updatedAt = new Date();

    let updates = { $set: req.body };
    let result = await User.updateOne({ _id: req.params.id }, updates);

    res.status(200).json({ 
      message: "User updated successfully",
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate key error",
        field: Object.keys(error.keyPattern)[0],
      });
    }
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// DELETE / - Delete one or multiple users by IDs
router.delete("/", verifyToken, async function (req, res) {
  try {
    const { ids } = req.body;

    if (!ids || (Array.isArray(ids) && ids.length === 0)) {
      return res.status(400).json({ message: "No user IDs provided" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only administrators can delete users" });
    }

    const idsArray = Array.isArray(ids) ? ids : [ids];
    if (idsArray.includes(req.user._id.toString())) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    for (const id of idsArray) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid user ID format: ${id}` });
      }
    }

    const result = await User.deleteMany({ _id: { $in: idsArray } });

    res.status(200).json({ message: `Deleted ${result.deletedCount} user(s)` });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

module.exports = router;