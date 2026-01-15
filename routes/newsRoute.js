const express = require("express");
const router = express.Router();
const { getTestNews } = require("../controllers/newsController");
router.get("/test", getTestNews);
module.exports = router;
