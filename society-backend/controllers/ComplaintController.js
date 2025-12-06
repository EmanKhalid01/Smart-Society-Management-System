// controllers/ComplaintController.js
const Complaint = require("../models/Complaint");

//  Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    // Admin & Resident can both view all complaints
    const complaints = await Complaint.find()
      .populate("userId", "name email role") // Populate name/email for frontend
      .sort({ date: -1 }); // Newest first
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

//  Create complaint (Only Resident)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newComplaint = new Complaint({
      title,
      description,
      date,
      userId: req.user.id, // ✅ Attach logged-in user's ID from token
    });
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: "Failed to create complaint" });
  }
};

//  Update complaint (Resident can update their own, Admin can update any)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    // 🔹 Only allow if admin OR owner
    if (req.user.role !== "admin" && complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this complaint" });
    }
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ error: "Failed to update complaint" });
  }
};

//  Delete complaint (Resident: own only, Admin: resolved only)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    const isAdmin = req.user.role === "admin";
    const isOwner = complaint.userId.toString() === req.user.id;
    if (isAdmin) {
      // Admin can only delete resolved complaints
      if (!complaint.resolved) {
        return res.status(403).json({ error: "Admin can delete only resolved complaints" });
      }
    } else {
      // Resident can only delete their own complaint
      if (!isOwner) {
        return res.status(403).json({ error: "Not authorized to delete this complaint" });
      }
    }
    await complaint.deleteOne(); // ✅ Use deleteOne() instead of remove() (deprecated)
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Failed to delete complaint" });
  }
};
