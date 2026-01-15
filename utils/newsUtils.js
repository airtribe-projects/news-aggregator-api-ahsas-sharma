require("dotenv").config();
const { formatUserPreferencesForRequest } = require("./userUtils");

const NEWS_API_ENDPOINT =
  "https://eventregistry.org/api/v1/article/getArticles";

async function fetchArticles(userPreferences) {
  try {
    const apiKey = process.env.ER_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error:
          "Event Registry API key is not configured properly. Check the .env.example file for reference.",
      };
    }

    const url = new URL(NEWS_API_ENDPOINT);
    // Format user preferences into request body
    const requestBody = formatUserPreferencesForRequest(userPreferences);
    requestBody.apiKey = apiKey;

    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Event Registry API error: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      articles: data.articles?.results || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  fetchArticles,
};
