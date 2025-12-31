var express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", async function (req, res) {
  try {
    let results = await User.find({}).select("-password");

    if (!results || results.length === 0) {
      return res.status(404).send({ error: "Users not found" });
    }

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

router.get("/myaccount", verifyToken, async function (req, res) {
  try {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isActive: req.user.isActive,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

router.post("/register", async function (req, res) {
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

router.post("/", verifyToken, async function (req, res) {
  try {
    let newDocument = req.body;
    let result = await User.insertOne(newDocument);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.get("/:id", verifyToken, async function (req, res) {
  try {
    let query = { _id: req.params.id };
    let result = await User.findOne(query).select("-password");

    if (!result) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.put("/:id", verifyToken, async function (req, res) {
  try {
    let query = { _id: req.params.id };

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "No update data provided" });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    let updates = { $set: req.body };

    let result = await User.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User updated", result });
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.delete("/:username", verifyToken, async function (req, res) {
  try {
    let query = { username: req.params.username };
    let result = await User.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User deleted" });
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

module.exports = router;
