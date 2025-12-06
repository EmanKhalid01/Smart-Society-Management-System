const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/AuthRoutes');
const residentRoutes = require("./routes/ResidentRoutes");
const noticeRoutes = require("./routes/NoticeRoutes");
const complaintRoutes = require("./routes/ComplaintRoutes");
const eventRoutes = require("./routes/EventRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const ParkingRoutes = require("./routes/ParkingRoutes");
const VisitorRoutes = require("./routes/VisitorRoutes");
const DashboardRoutes = require("./routes/DashboardRoutes");
const SettingRoutes = require("./routes/SettingRoutes");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());                      // Parse JSON
app.use('/api/auth', authRoutes);            // 👈 Authentication routes
app.use('/api/residents', residentRoutes);  // 👈 Resident routes
app.use('/api/notices', noticeRoutes);      // 👈 Notice routes
app.use('/api/complaints', complaintRoutes); // 👈 Complaint routes
app.use('/api/events', eventRoutes);        // 👈 Event routes
app.use('/api/payments', paymentRoutes);    // 👈 Payment routes
app.use('/api/parking', ParkingRoutes);      // 👈 Parking routes
app.use('/api/visitors', VisitorRoutes);    // 👈 Visitor routes
app.use('/api/dashboard', DashboardRoutes);  // 👈 Dashboard routes
app.use('/api/settings', SettingRoutes);    // 👈 Settings routes
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from uploads directory

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// This code sets up an Express server with MongoDB connection and CORS enabled.