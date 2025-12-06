// models/Notice.js
const mongoose = require("mongoose");
const NoticeSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  message:    { type: String, required: true },
  important:  { type: Boolean, default: false },
  date:       { type: Date, default: Date.now },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin who posted
});

module.exports = mongoose.model("Notice", NoticeSchema);
