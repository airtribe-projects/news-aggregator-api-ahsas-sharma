const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/health", (req, res) => {
  res.json({
    message:
      "Welcome to the News Aggregator API! Login by sending a POST request to /api/v1/auth to get started",
  });
});
