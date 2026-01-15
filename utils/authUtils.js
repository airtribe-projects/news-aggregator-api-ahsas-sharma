const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");

require("dotenv").config();

async function encryptPassword(plainTextPassword) {
  const saltRounds = await bcrypt.genSalt(10);
  return bcrypt.hashSync(plainTextPassword, saltRounds);
}

async function verifyPassword(plainTextPassword, hashedPassword) {
  return bcrypt.compareSync(plainTextPassword, hashedPassword);
}

function generateToken(userId) {
  return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function registerUser(email, password) {
  try {
    const newUser = UserModel({
      password: await encryptPassword(password),
      email,
    });

    const savedUser = await newUser.save();

    return {
      success: true,
      user: savedUser,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function loginUser(email, password) {
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    return {
      success: false,
      error: "Email not found. Please register to proceed",
    };
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return {
      success: false,
      error: "Email or Password is invalid. Please check and try again.",
    };
  }

  const token = generateToken(user._id);
  return { success: true, user, token };
}

async function findUserById(userId) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  encryptPassword,
  registerUser,
  loginUser,
  generateToken,
  findUserById,
};
