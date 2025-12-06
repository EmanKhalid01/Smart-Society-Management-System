const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["Paid", "Pending"], required: true },
  purpose: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Link to user
});

module.exports = mongoose.model("Payment", paymentSchema);
