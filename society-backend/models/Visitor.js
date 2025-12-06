// models/Visitor.js
const mongoose = require("mongoose");
const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // who added
}, { timestamps: true });

module.exports = mongoose.model("Visitor", visitorSchema);
