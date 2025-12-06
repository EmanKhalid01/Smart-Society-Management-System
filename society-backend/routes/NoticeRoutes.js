// routes/NoticeRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/NoticeController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// View notices – for all authenticated users
router.get("/", verifyToken, getAllNotices);

// Admin routes
router.post("/", verifyToken, verifyRole("admin"), createNotice);
router.put("/:id", verifyToken, verifyRole("admin"), updateNotice);
router.delete("/:id", verifyToken, verifyRole("admin"), deleteNotice);

module.exports = router;
