// controllers/AuthController.js
const User = require("../models/User");
const Resident = require("../models/Resident");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register Controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, apartment, contact } = req.body;
    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already in use" });
    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 👤 Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    // 🏡 If user is a resident, also create Resident document
    if ((role || "").toLowerCase() === "resident") {
      try {
        const newResident = new Resident({
          name,
          apartment,
          contact,
          user: newUser._id,
        });
        await newResident.save();
      } catch (err) {
        console.error("Resident creation error:", err);
        return res
          .status(500)
          .json({ error: "Failed to create resident entry" });
      }
    }
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login Controller
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });
    // 🔹 JWT payload uses 'id'
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // 🔹 Response user object uses '_id' for frontend compatibility
    res.status(200).json({
      token,
      user: {
        _id: user._id,      // ✅ Keep _id for React checks
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
