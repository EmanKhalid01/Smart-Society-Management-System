import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";

function Events() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", date: "", description: "" });
  const [editId, setEditId] = useState(null);

  // ✅ Fetch Events from backend
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Fetch Events Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit (Admin Only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update event
        const res = await axios.put(
          `http://localhost:5000/api/events/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents(events.map((ev) => (ev._id === editId ? res.data : ev)));
        setEditId(null);
      } else {
        // Add new event
        const res = await axios.post(
          "http://localhost:5000/api/events",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEvents([res.data, ...events]); // Add to top
      }
      setFormData({ title: "", date: "", description: "" });
    } catch (err) {
      console.error("❌ Submit Event Error:", err.response?.data || err.message);
    }
  };

  // ✅ Handle edit
  const handleEdit = (event) => {
    setEditId(event._id);
    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
    });
  };

  // ✅ Handle delete (Admin Only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((ev) => ev._id !== id));
    } catch (err) {
      console.error("❌ Delete Event Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Events</h2>
        {/* 📝 Admin: Add/Edit Event Form */}
        {user?.role === "admin" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {editId ? "Update Event" : "Add Event"}
            </button>
          </form>
        )}
        {/* 📅 Events Table */}
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((ev) => (
                    <tr key={ev._id} className="border-b">
                      <td className="px-6 py-4">{ev.title}</td>
                      <td className="px-6 py-4">{ev.date}</td>
                      <td className="px-6 py-4">{ev.description}</td>
                      <td className="px-6 py-4">
                        {user?.role === "admin" ? (
                          <>
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleEdit(ev)}
                              className="bg-yellow-400 text-white px-3 py-1 text-xs rounded hover:bg-yellow-500 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(ev._id)}
                              className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No events found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Events;

