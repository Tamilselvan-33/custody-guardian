"use strict";

const mongoose = require("mongoose");

const roles = ["citizen", "police", "lawyer"];

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: roles,
      default: "citizen",
    },
    organization: {
      type: String,
      trim: true,
    },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
module.exports.roles = roles;

