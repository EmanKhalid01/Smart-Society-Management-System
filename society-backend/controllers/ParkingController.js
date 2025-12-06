// controllers/ParkingController.js
const Parking = require("../models/Parking");

// Get parking slots
exports.getParkingSlots = async (req, res) => {
  try {
    let slots;
    if (req.user.role === "admin") {
      slots = await Parking.find();
    } else {
      slots = await Parking.find(); 
    }
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch parking slots" });
  }
};

// Create slot
exports.createSlot = async (req, res) => {
  try {
    const { slot, resident, vehicle } = req.body;
    if (!slot  || !resident || !vehicle) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingSlot = await Parking.findOne({ slot });
    if (existingSlot) {
      return res.status(400).json({ error: "Slot already allocated" });
    }
    const newSlot = new Parking({
      slot,
      resident,
      vehicle,
      user: req.user.id, // from verifyToken
    });
    const savedSlot = await newSlot.save();
    res.status(201).json(savedSlot);
  } catch (error) {
    console.error("Error creating parking slot:", error);
    res.status(500).json({ error: "Server error while creating slot" });
  }
};

// Update slot
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { slot, resident, vehicle } = req.body;
    const updatedSlot = await Parking.findByIdAndUpdate(
      id,
      { slot, resident, vehicle },
      { new: true, runValidators: true }
    );
    if (!updatedSlot) {
      return res.status(404).json({ error: "Slot not found" });
    }
    res.json(updatedSlot);
  } catch (error) {
    console.error("Error updating parking slot:", error);
    res.status(500).json({ error: "Server error while updating slot" });
  }
};

// Delete slot
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSlot = await Parking.findByIdAndDelete(id);
    if (!deletedSlot) {
      return res.status(404).json({ error: "Slot not found" });
    }
    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    console.error("Error deleting parking slot:", error);
    res.status(500).json({ error: "Server error while deleting slot" });
  }
};
