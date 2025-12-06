const Visitor = require("../models/Visitor");

// GET all visitors
exports.getVisitors = async (req, res) => {
  try {
    let visitors;
    if (req.user.role === "admin") {
      visitors = await Visitor.find().sort({ createdAt: -1 });
    } else {
      visitors = await Visitor.find().sort({ createdAt: -1 });
    }
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD visitor
exports.addVisitor = async (req, res) => {
  try {
    const newVisitor = new Visitor({
      name: req.body.name,
      purpose: req.body.purpose,
      date: req.body.date,
      time: req.body.time,
      user: req.user.id
    });
    const saved = await newVisitor.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE visitor
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (req.user.role !== "admin" && visitor.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    visitor.name = req.body.name;
    visitor.purpose = req.body.purpose;
    visitor.date = req.body.date;
    visitor.time = req.body.time;

    const updated = await visitor.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (req.user.role !== "admin" && visitor.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await visitor.deleteOne();
    res.json({ message: "Visitor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
