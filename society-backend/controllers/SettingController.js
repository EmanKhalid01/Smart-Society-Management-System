const User = require("../models/User");
const getServerUrl = require("../utils/getServerUrl");
const path = require("path");
const fs = require("fs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If photo exists, send full URL
    if (user.profilePhoto) {
      user.profilePhoto = `${getServerUrl(req)}/uploads/${user.profilePhoto}`;
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { name: req.body.name };
    if (req.body.password) {
      updates.password = req.body.password;
    }

    if (req.file) {
      updates.profilePhoto = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    if (user.profilePhoto) {
      user.profilePhoto = `${getServerUrl(req)}/uploads/${user.profilePhoto}`;
    }

    res.json({
      message: "✅ Profile updated successfully!",
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
