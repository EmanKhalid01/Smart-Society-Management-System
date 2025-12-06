// routes/ParkingRoutes.js
const express = require("express");
const router = express.Router();
const {
  getParkingSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/ParkingController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// ✅ Get parking slots (admin sees all, resident sees own)
router.get("/", verifyToken, getParkingSlots);

// ✅ Allocate a slot (admin only)
router.post("/", verifyToken, verifyRole("admin"), createSlot);

// ✅ Update slot (admin only)
router.put("/:id", verifyToken, verifyRole("admin"), updateSlot);

// ✅ Delete slot (admin only)
router.delete("/:id", verifyToken, verifyRole("admin"), deleteSlot);

module.exports = router;
