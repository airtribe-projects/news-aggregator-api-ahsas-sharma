const express = require("express");
const router = express.Router();
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/preferencesController");
router.get("/", getPreferences);
router.patch("/", updatePreferences);

module.exports = router;
