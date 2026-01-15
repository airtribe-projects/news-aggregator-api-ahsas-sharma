const UserModel = require("../models/UserModel");

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
  findUserById,
};
