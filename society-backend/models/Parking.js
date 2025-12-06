// models/Parking.js
const mongoose = require("mongoose");
const parkingSchema = new mongoose.Schema({
  slot: { type: String, required: true, unique: true, trim: true },
  resident: { type: String, required: true, trim: true },
  vehicle: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Link to user
}, { timestamps: true });

module.exports = mongoose.model("Parking", parkingSchema);
