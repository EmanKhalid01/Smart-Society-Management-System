const express = require("express");
const router = express.Router();
const VisitorController = require("../controllers/VisitorController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

// Get all visitors (Admin sees all, Residents see only their own)
router.get("/", verifyToken, VisitorController.getVisitors);

// Add visitor (Both Admin & Residents can add)
router.post("/", verifyToken, VisitorController.addVisitor);

// Update visitor (Admin can update any, Resident only own)
router.put("/:id", verifyToken, VisitorController.updateVisitor);

// Delete visitor (Admin can delete any, Resident only own)
router.delete("/:id", verifyToken, verifyRole("admin"), VisitorController.deleteVisitor);

module.exports = router;
