import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { MessageCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalComplaints: 0,
    totalPayments: 0,
    paymentData: [],
    recentActivities: [],
    notices: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // if you have JWT
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <div className="max-w-5xl mx-auto">
          {/* 👋 Welcome */}
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome👋</h1>
          <p className="text-gray-600 mb-8">Here’s what’s happening in your society today!</p>

          {/* 📊 Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-blue-600">{stats.totalResidents}</h2>
              <p className="text-gray-500">Total Residents</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-red-500">{stats.totalComplaints}</h2>
              <p className="text-gray-500">Complaints</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <h2 className="text-2xl font-bold text-green-600">{stats.totalPayments}</h2>
              <p className="text-gray-500">Payments</p>
            </div>
          </div>

          {/* 📊 Payments Chart */}
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Monthly Payments</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🕒 Recent Activity Feed */}
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              {stats.recentActivities.map((activity, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="h-3 w-3 rounded-full mt-1 bg-blue-500" />
                  <div>
                    <p className="text-gray-800">{activity.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 📢 Notices Preview */}
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Notices</h2>
            <ul className="space-y-4">
              {stats.notices.map((notice, index) => (
                <li key={index}>
                  <h3 className="text-md font-semibold text-gray-800">{notice.title}</h3>
                  <p className="text-gray-600 text-sm">{notice.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🚨 Emergency Contact */}
        <div className="bg-white p-4 rounded-xl shadow mt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-2">🚨 Emergency Contact</h3>
          <p className="text-gray-600">In case of urgent issues, contact security instantly.</p>
          <a
            href="https://wa.me/923486055115?text=Emergency%20in%20our%20society!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <MessageCircle size={20} className="mr-2" /> WhatsApp Security
          </a>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
