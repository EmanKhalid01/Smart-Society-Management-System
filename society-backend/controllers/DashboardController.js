const Resident = require("../models/Resident");
const Complaint = require("../models/Complaint");
const Payment = require("../models/Payment");
const Notice = require("../models/Notice");

exports.getDashboardData = async (req, res) => {
  try {
    // 1. Stats
    const totalResidents = await Resident.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // 2. Monthly payments chart data (using createdAt)
    const monthlyPayments = await Payment.aggregate([
      { $match: { createdAt: { $type: "date" } } }, // only valid dates
      {
        $group: {
          _id: { $month: "$createdAt" },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const paymentData = monthlyPayments.map(mp => ({
      month: monthNames[mp._id - 1],
      amount: mp.amount
    }));

    // 3. Recent Activities (keep real dates for sorting)
    const complaintActivities = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("description createdAt")
      .lean()
      .then(list =>
        list.map(c => ({
          type: "complaint",
          text: `Complaint: ${c.description}`,
          time: timeAgo(c.createdAt),
          date: c.createdAt
        }))
      );
    const paymentActivities = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("purpose createdAt")
      .lean()
      .then(list =>
        list.map(p => ({
          type: "payment",
          text: `Payment made for ${p.purpose}`,
          time: timeAgo(p.createdAt),
          date: p.createdAt
        }))
      );
    const residentActivities = await Resident.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name flatNo createdAt")
      .lean()
      .then(list =>
        list.map(r => ({
          type: "resident",
          text: `New resident: ${r.name} in ${r.flatNo}`,
          time: timeAgo(r.createdAt),
          date: r.createdAt
        }))
      );

    // Merge & take latest 5 based on real date
    let allActivities = [...complaintActivities, ...paymentActivities, ...residentActivities];
    allActivities = allActivities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(({ date, ...rest }) => rest); // remove raw date from final output

    // 4. Recent Notices
    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title detail createdAt")
      .lean()
      .then(list =>
        list.map(n => ({
          title: n.title,
          detail: n.detail,
          date: n.createdAt ? n.createdAt.toISOString().split("T")[0] : ""
        }))
      );

    res.json({
      totalResidents,
      totalComplaints,
      totalPayments,
      paymentData,
      recentActivities: allActivities,
      notices: recentNotices
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper: time ago formatter
function timeAgo(date) {
  if (!date) return "Unknown";
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value > 1) return `${value} ${key}s ago`;
    if (value === 1) return `1 ${key} ago`;
  }
  return "Just now";
}
