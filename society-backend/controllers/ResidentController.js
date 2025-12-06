// controllers/ResidentController.js
const Resident = require("../models/Resident");
// ✅ Get all residents
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find()
    .populate("user", "_id name email role"); // Populate linked user details
    res.status(200).json(residents);
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({ error: "Failed to fetch residents" });
  }
};

// ✅ Create a new resident
exports.createResident = async (req, res) => {
  try {
    const { name, apartment, contact } = req.body;
    console.log("Request body:", { name, apartment, contact });
    console.log("Authenticated user:", req.user);
    const resident = new Resident({
      name,
      apartment,
      contact,
      user: req.user.id, // link resident to logged-in user
    });
    await resident.save();
    console.log("Resident created:", resident);
    res.status(201).json(resident);
  } catch (err) {
    console.error("Resident POST error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a resident
exports.updateResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id); // ✅ updated here
    if (!resident) return res.status(404).json({ error: "Resident not found" });
    // ✅ Only admin or the owner can update
    if (req.user.role !== "admin" && resident.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    const updated = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true }); // ✅ updated here
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a resident
exports.deleteResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id); // ✅ updated here
    if (!resident) return res.status(404).json({ error: "Resident not found" });
    // ✅ Only admin or the owner can delete
    if (req.user.role !== "admin" && resident.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    await resident.deleteOne();
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
