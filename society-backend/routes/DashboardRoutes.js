// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/DashboardController");
const verifyToken = require("../middleware/verifyToken"); // optional if you want auth

router.get("/", verifyToken, dashboardController.getDashboardData);

module.exports = router;
