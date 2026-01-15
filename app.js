const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const newsRoute = require("./routes/newsRoute");
const preferencesRoute = require("./routes/preferencesRoute");
const authMiddleware = require("./middleware/authMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/preferences", authMiddleware, preferencesRoute);
app.use("/api/v1/news", authMiddleware, newsRoute);

app.use("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    message: "Welcome to the News Aggregator API!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

module.exports = app;
