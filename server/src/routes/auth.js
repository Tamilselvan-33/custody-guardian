"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const toSafeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  organization: user.organization,
});

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Account already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: "citizen",
    });
    const token = signToken(user);
    res.status(201).json({ token, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Unable to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.lastLoginAt = new Date();
    await user.save();
    const token = signToken(user);
    res.json({ token, user: toSafeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Unable to login" });
  }
});

module.exports = router;

