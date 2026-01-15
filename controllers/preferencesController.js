const { findUserById, updateUserPreferences } = require("../utils/userUtils");

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

    const updateResult = await updateUserPreferences(result.user, req.body);

    if (!updateResult.success) {
      const statusCode = updateResult.message ? 400 : 500;
      return res.status(statusCode).json({
        message: updateResult.error,
        ...(updateResult.invalidKeys && {
          invalidKeys: updateResult.invalidKeys,
        }),
        ...(updateResult.message && { details: updateResult.message }),
      });
    }

    return res.status(200).json({
      message: "User preferences updated successfully!",
      preferences: updateResult.preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { getPreferences, updatePreferences };
