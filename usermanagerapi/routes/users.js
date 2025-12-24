var express = require('express');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
var router = express.Router();

router.get('/', async function(req, res) {
try {
    let results = await User.find({});

    if (!results || results.length === 0) {
      return res.status(404).send({ error: "Users not found" });
    }
    
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.get('/:username', verifyToken, async function(req, res) {
  try {
    let query = { username: req.params.username };
    let result = await User.findOne(query);
    
    if (!result) {
      return res.status(404).send({ error: "User not found" });
    }
    
    res.status(200).send(result);
  } catch(error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});


router.post('/', verifyToken, async function(req, res) {
  try {
    let newDocument = req.body;
    let result = await User.insertOne(newDocument);
    res.status(201).send(result);
  } catch(error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.put('/:username', verifyToken, async function(req, res) {
  try {
    let query = { username: req.params.username };
    let updates = { $set: req.body };
    
    let result = await User.updateOne(query, updates);
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    
    res.status(200).send({ message: "User updated", result });
  } catch(error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

router.delete('/:username', verifyToken, async function(req, res) {
  try {
    let query = { username: req.params.username };
    let result = await User.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    
    res.status(200).send({ message: "User deleted" });
  } catch(error) {
    res.status(500).send({ error: "Server error", details: error.message });
  }
});

module.exports = router;