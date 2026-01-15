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

async function updateUserPreferences(user, changePayload) {
  try {
    const allowedKeys = Object.keys(user.preferences.schema.paths);

    const invalidKeys = Object.keys(changePayload).filter(
      (key) => !allowedKeys.includes(key)
    );

    if (invalidKeys.length > 0) {
      return {
        success: false,
        error: "Invalid preference keys provided",
        invalidKeys,
      };
    }

    Object.keys(changePayload).forEach((key) => {
      user.preferences[key] = changePayload[key];
    });

    await user.save();

    return {
      success: true,
      preferences: user.preferences,
    };
  } catch (error) {
    if (error.name === "ValidationError") {
      return {
        success: false,
        message: "Invalid preference values",
        error: error.message,
      };
    }
    return {
      success: false,
      error: error.message,
    };
  }
}

function formatUserPreferencesForRequest(preferences) {
  const requestBody = {
    action: "getArticles",
    resultType: "articles",
    keyword: preferences.keyword,
    keywordOper: "or",
    lang: preferences.language || "eng",
    maxDaysBack: preferences.maxDaysBack || 1,
    articleIsDuplicate: preferences.isDuplicateFilter || "skipDuplicates",
    dataType: "news",
    articlesCount: preferences.articlesCount,
    articlesSortBy: preferences.articlesSortBy,
    articlesSortByAsc: preferences.articlesSortByAsc,
    ignoreKeyword: preferences.ignoreKeyword,
    minSentiment: preferences.minSentiment,
    maxSentiment: preferences.maxSentiment,
  };
  return requestBody;
}

module.exports = {
  findUserById,
  updateUserPreferences,
  formatUserPreferencesForRequest,
};
