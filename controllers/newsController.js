require("dotenv").config();

async function getTestNews(req, res) {
  try {
    const apiKey = process.env.ER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          "Event Registry PAI key is not configured properly. Check the .env.example file for reference.",
      });
    }
    const keyword = req.query.keyword || "Donald Trump";
    const url = new URL("https://eventregistry.org/api/v1/article/getArticles");
    url.searchParams.append("apiKey", apiKey);
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("lang", "eng");
    url.searchParams.append("articlesCount", "100");
    url.searchParams.append("articlesSortBy", "date");
    url.searchParams.append("resultType", "articles");
    console.log("🚀 ~ getTestNews ~ url:", url.href);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Event Registry API error: ${response.status}`);
    }
    const data = await response.json();

    res.status(200).json({
      articles: data.articles?.results || [],
    });
  } catch (error) {
    res.status(404).json({ error: "Server Error" });
    console.log("Server Error : ", error);
  }
}

module.exports = {
  getTestNews,
};
