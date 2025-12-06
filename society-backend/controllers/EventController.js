// controllers/EventController.js
const Event = require("../models/Event");
// ✅ Get all events (Everyone can view)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // oldest first
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Add new event (Admin Only)
exports.createEvent = async (req, res) => {
  try { 
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      createdBy: req.user.id,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// ✅ Update event (Admin Only)
exports.updateEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update events" });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) 
      return res.status(404).json({ error: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// ✅ Delete event (Admin Only)
exports.deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete events" });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    await event.remove();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
