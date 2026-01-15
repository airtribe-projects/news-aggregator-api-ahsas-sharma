const { fetchArticles } = require("../utils/newsUtils");
const { findUserById } = require("../utils/userUtils");

async function getNews(req, res) {
  try {
    const result = await findUserById(req.payload.userId);

    if (!result.success) {
      return res.status(401).json({ message: result.error });
    }

    let newsResult = await fetchArticles(result.user.preferences || {});

    if (!newsResult.success) {
      return res.status(500).json({ error: newsResult.error });
    }

    res.status(200).json({
      news: newsResult.articles,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getNews,
};
