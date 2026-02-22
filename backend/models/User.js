const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },
    firebaseUid: {
      type: String,
      sparse: true,
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ["email", "google", "microsoft", "apple", "phone"],
      default: "email",
    },
    photoURL: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Compound index — email must be unique when it exists
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);

// Hash password before saving (only for email-based users)
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Validate: email-based users MUST have a password
userSchema.pre("save", function (next) {
  if (this.authProvider === "email" && !this.password && this.isNew) {
    return next(new Error("Password is required for email registration."));
  }
  next();
});

// Compare candidate password against stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
