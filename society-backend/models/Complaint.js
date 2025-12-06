// models/Complaint.js
const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Complaint", complaintSchema);
