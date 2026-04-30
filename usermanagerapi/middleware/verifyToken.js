const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing bearer token" });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      _id: decoded.sub,
      role: decoded.role,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;