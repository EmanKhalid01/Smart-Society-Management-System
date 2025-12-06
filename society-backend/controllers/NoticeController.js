// controllers/NoticeController.js
const Notice = require("../models/Notice");
// Get all notices (accessible to all logged-in users)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 }); // Newest first
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new notice (Admin only)
exports.createNotice = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create notices." });
  }
  try {
    const { title, message, important } = req.body;
    const newNotice = new Notice({
      title,
      message,
      important,
      user: req.user.id, // From verifyToken middleware
    });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a notice (Admin only)
exports.updateNotice = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can update notices." });
  }
  try {
    const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.status(200).json(updatedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a notice (Admin only)
exports.deleteNotice = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete notices." });
  }
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
