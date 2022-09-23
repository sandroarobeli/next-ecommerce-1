const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Define User class per its Schema (Blueprint)
// Syntax is as follows in Next.js mongoose configuration looks like.
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
