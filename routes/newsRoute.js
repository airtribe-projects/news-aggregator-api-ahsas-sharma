const express = require("express");
const { getTestNews } = require("../controllers/newsController");

const router = express.Router();

router.get("/test", getTestNews);

module.exports = router;
