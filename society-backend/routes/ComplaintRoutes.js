// routes/ComplaintRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");
const complaintController = require("../controllers/ComplaintController");

// 🔹 Fetch all complaints (Admin can see all, Residents can see all but only edit/delete their own)
router.get("/", verifyToken, verifyRole(["admin", "resident"]), // ✅ Allow both roles
  complaintController.getComplaints
);
// 🔹 Create new complaint (Only residents can submit complaints)
router.post("/", verifyToken,verifyRole("resident"), // ✅ Only residents can submit
  complaintController.createComplaint
);
// 🔹 Update complaint (Resident can update their own, Admin can update any)
router.put("/:id", verifyToken, verifyRole(["admin", "resident"]), // ✅ Allow both, controller will handle own-check
  complaintController.updateComplaint
);
// 🔹 Delete complaint (Resident can delete own, Admin can delete resolved only)
router.delete("/:id", verifyToken,verifyRole(["admin", "resident"]),
  complaintController.deleteComplaint
);

module.exports = router;
