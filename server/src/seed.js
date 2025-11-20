"use strict";

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const defaultAccounts = [
  {
    fullName: "Duty Officer",
    email: "police@custody.guard",
    role: "police",
  },
  {
    fullName: "Legal Counsel",
    email: "lawyer@custody.guard",
    role: "lawyer",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const account of defaultAccounts) {
      const existing = await User.findOne({ email: account.email });
      if (existing) {
        console.log(`${account.role} account already exists`);
        continue;
      }
      const password = "ChangeMe123!";
      const hashed = await bcrypt.hash(password, 10);
      await User.create({
        ...account,
        password: hashed,
      });
      console.log(`Created ${account.role} account`, {
        email: account.email,
        password,
      });
    }
  } catch (error) {
    console.error("Seeding failed", error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();

