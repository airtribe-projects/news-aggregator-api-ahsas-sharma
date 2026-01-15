const express = require("express");
const app = express();
const newsRoute = require("./routes/newsRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/news", newsRoute);
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
