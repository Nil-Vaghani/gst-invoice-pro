const express = require("express");
const jwt = require("jsonwebtoken");
const { getAdmin } = require("../firebaseAdmin");
const User = require("../models/User");

const router = express.Router();

// Helper — generate JWT with 7-day expiry
function generateToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

// ── POST /api/auth/signup ─────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(". "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
});

// ── POST /api/auth/login ──────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

// ── POST /api/auth/social ─────────────────────────────────
// Verify Firebase ID token, find-or-create user, return JWT
router.post("/social", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required.",
      });
    }

    // 1. Verify the token with Firebase Admin
    let admin;
    try {
      admin = getAdmin();
    } catch (configErr) {
      return res.status(503).json({
        success: false,
        message: configErr.message,
      });
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (firebaseErr) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase token.",
      });
    }

    const { uid, email, name, picture, phone_number, firebase } = decodedToken;

    // Determine auth provider from Firebase sign_in_provider
    const providerMap = {
      "google.com": "google",
      "microsoft.com": "microsoft",
      "apple.com": "apple",
      phone: "phone",
    };
    const authProvider = providerMap[firebase?.sign_in_provider] || "google";

    // 2. Find existing user by firebaseUid OR email
    let user = await User.findOne({ firebaseUid: uid });

    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        // Link existing email user to Firebase
        user.firebaseUid = uid;
        user.authProvider = authProvider;
        if (picture && !user.photoURL) user.photoURL = picture;
        await user.save();
      }
    }

    // 3. Create new user if not found
    if (!user) {
      const userData = {
        name: name || decodedToken.name || email?.split("@")[0] || "User",
        firebaseUid: uid,
        authProvider,
        photoURL: picture || null,
      };

      if (email) {
        userData.email = email.toLowerCase();
      }
      if (phone_number) {
        userData.phone = phone_number;
        if (!userData.name || userData.name === "User") {
          userData.name = `User ${phone_number.slice(-4)}`;
        }
      }

      user = await User.create(userData);
    }

    // 4. Generate our own JWT
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Social login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email || null,
          phone: user.phone || null,
          photoURL: user.photoURL || null,
          authProvider: user.authProvider,
        },
      },
    });
  } catch (error) {
    console.error("Social auth error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during social authentication.",
      error: error.message,
    });
  }
});

module.exports = router;
