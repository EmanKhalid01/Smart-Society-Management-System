const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/SettingController");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/uploads");

// Get profile
router.get("/me", verifyToken, getProfile);

// Update profile (with optional image)
router.put("/update", verifyToken, upload.single("profilePhoto"), updateProfile);

module.exports = router;
