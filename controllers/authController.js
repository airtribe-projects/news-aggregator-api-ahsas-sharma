const { registerUser, loginUser } = require("../utils/authUtils");

require("dotenv").config();

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await registerUser(name, email, password);
    if (!result.success) {
      if (result.error.includes("E11000")) {
        return res.status(400).json({
          message:
            "Email already registered. Please login using your password.",
        });
      }

      return res.status(400).json({ message: result.error });
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        createdAt: result.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(401).json({ message: result.error });
    }

    res.status(200).json({
      message: "Logged in successfully!",
      user: {
        id: result.user._id,
        email: result.user.email,
      },
      token: result.token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
};
