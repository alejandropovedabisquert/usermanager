var express = require("express");
const jwt = require("jsonwebtoken");
var router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET + "_refresh";

// POST / - Refresh token
router.post("/", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      {
        _id: decoded._id,
        username: decoded.username,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        isActive: decoded.isActive,
        role: decoded.role,
        createdAt: decoded.createdAt,
        updatedAt: decoded.updatedAt,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ 
      token: newAccessToken,
      message: "Token refreshed successfully" 
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

module.exports = router;