// controllers/PaymentController.js
const Payment = require("../models/Payment");

// Get Payments
exports.getPayments = async (req, res) => {
  try {
    let payments;
    if (req.user.role === "admin") {
      // Admin can view all payments
      payments = await Payment.find().populate("user", "name email");
    } else {
      // Resident can view only their own payments
      payments = await Payment.find({ user: req.user.id });
    }
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, purpose, date, status } = req.body;
    if (!amount || !purpose) {
      return res.status(400).json({ error: "Amount and purpose are required" });
    }
    // Fetch name from User collection
    const User = require("../models/User");
    const userDoc = await User.findById(req.user.id).select("name");
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }
    const payment = new Payment({
      user: req.user.id,             // matches your schema field
      name: userDoc.name,            // fetched from DB
      amount,
      purpose,
      status: status || "Pending",
      date: date || new Date().toISOString().split("T")[0]
    });
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Update Payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    // Only the owner can update their payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    // Only the owner can delete their payment
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await payment.remove();
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
