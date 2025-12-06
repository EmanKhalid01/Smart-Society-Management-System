// models/Resident.js
const mongoose = require("mongoose");
const ResidentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // 👈 Link to User collection
    ref: "User",
    required: true
  },
});

module.exports = mongoose.model("Resident", ResidentSchema);
