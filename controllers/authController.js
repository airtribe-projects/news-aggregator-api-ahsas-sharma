const UserModel = require("../models/UserModel");
const { encryptPassword, verifyPassword } = require("../utils/authUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

async function register(req, res) {
  console.log("🚀 ~ register ~ register:", register);
  try {
    const { email, password } = req.body;
    console.log("🚀 ~ register ~ req.body:", req.body);
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const newUser = UserModel({
      password: await encryptPassword(password),
      email,
    });
    console.log("🚀 ~ register ~ newUser:", newUser);

    const savedUser = await newUser.save();
    console.log("🚀 ~ register ~ savedUser:", savedUser);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req, res) {}

module.exports = {
  register,
  login,
};
