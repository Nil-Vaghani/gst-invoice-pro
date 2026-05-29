/**
 * @fileoverview Authentication Middleware
 * Validates JSON Web Tokens (JWT) from incoming API requests.
 * @module middleware/auth
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes by verifying JWTs present in the Authorization header.
 * Upon successful verification, attaches minimal user info (id, name, email)
 * to the `req.user` object for downstream use without additional DB hits.
 *
 * @function authMiddleware
 * @param {Object} req - Express Request object
 * @param {Object} res - Express Response object
 * @param {Function} next - Express Next middleware function
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
