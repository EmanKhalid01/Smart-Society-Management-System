// routes/ResidentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllResidents,
  createResident,
  updateResident,
  deleteResident,
} = require("../controllers/ResidentController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Public for authenticated users
router.get("/",  verifyToken, getAllResidents);      // Get all residents
// Admin only routes
router.post("/",  verifyToken, verifyRole("admin"), createResident);      // Add a new resident
// Admin can update or delete any resident, residents can only update or delete their own profile
router.put("/:id",  verifyToken, updateResident);    // Update resident
router.delete("/:id",  verifyToken, deleteResident); // Delete resident

module.exports = router;
