const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes — verifies JWT from Authorization header.
 * Attaches `req.user` (id, name, email) for downstream use.
 */
module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach minimal user info (no DB call needed for basic auth)
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Invalid token. Please log in again.";
    return res.status(401).json({ success: false, message });
  }
};
