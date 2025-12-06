// routes/EventRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const eventController = require("../controllers/EventController");

// Public - all authenticated users can view events
router.get("/", verifyToken, eventController.getEvents);
// Admin only for create, update, delete
router.post("/", verifyToken, eventController.createEvent);
router.put("/:id", verifyToken, eventController.updateEvent);
router.delete("/:id", verifyToken, eventController.deleteEvent);

module.exports = router;
