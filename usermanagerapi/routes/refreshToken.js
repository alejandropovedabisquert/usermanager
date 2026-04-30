var express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET + "_refresh";

const ACCESS_EXPIRES_IN = "15m";

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

router.post("/", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    const user = await User.findById(decoded.sub).select(
      "_id username role isActive refreshTokenVersion"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    if (decoded.tokenVersion !== user.refreshTokenVersion) {
      return res.status(401).json({ message: "Refresh token revoked" });
    }

    const newAccessToken = signAccessToken(user);

    return res.json({
      token: newAccessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    return res.status(500).json({
      message: "Server error",
      details: error.message,
    });
  }
});

module.exports = router;