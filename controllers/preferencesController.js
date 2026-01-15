const { findUserById } = require("../utils/userUtils");

async function getPreferences(req, res) {
  try {
    const result = await findUserById(req.payload.userId);
    if (!result.success) {
      return res.status(401).json({ message: result.error });
    }
    return res.status(200).json(result.user.preferences);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updatePreferences(req, res) {
  try {
    const result = await findUserById(req.payload.userId);
    if (!result.success) {
      return res.status(401).json({ message: result.error });
    }

    const user = result.user;
    const changePayload = req.body;

    const allowedKeys = Object.keys(user.preferences.schema.paths);

    const invalidKeys = Object.keys(changePayload).filter(
      (key) => !allowedKeys.includes(key)
    );

    if (invalidKeys.length > 0) {
      return res.status(400).json({
        message: "Invalid preference keys provided",
        invalidKeys,
      });
    }

    Object.keys(changePayload).forEach((key) => {
      user.preferences[key] = changePayload[key];
    });

    await user.save();
    return res.status(200).json({
      message: "User preferences updated succesfully!",
      preferences: user.preferences,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid preference values",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { getPreferences, updatePreferences };
