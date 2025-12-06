// models/User.js 
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // make sure no duplicate email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "resident"],
    default: "resident",
  },
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
