import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";

function Notices() {
  const { user } = useAuth();
  const role = user?.role;
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    important: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    message: "",
    important: false,
  });

  // Fetch all notices
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notices",{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotices(res.data);
      } catch (err) {
        console.error(" Error fetching notices: ", err);
      }
    };
    fetchNotices();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    if (editingId) {
      setEditForm({ ...editForm, [name]: fieldValue });
    } else {
      setFormData({ ...formData, [name]: fieldValue });
    }
  };

  // Handle Add Notice
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/notices", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices([res.data, ...notices]);
      setFormData({ title: "", message: "", important: false });
    } catch (err) {
      console.error("Add Notice Error:", err.response?.data || err.message);
    }
  };

  // Handle Edit Save
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/notices/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(notices.map((notice) => (notice._id === id ? res.data : notice)));
      setEditingId(null);
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Notices</h2>

        {/* 🔐 Admin Only - Add Notice Form */}
        {role === "admin" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-8 space-y-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex items-center justify-between mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="important"
                checked={formData.important}
                onChange={handleChange}
                className="mr-2"
              />
              Mark as Important
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Notice
            </button>
            </div>
          </form>
        )}

        {/* 📋 Notices List */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`p-4 rounded shadow ${
                notice.important ? "bg-yellow-100 border-l-4 border-yellow-500" : "bg-white"
              }`}
            >
              {editingId === notice._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <textarea
                    name="message"
                    value={editForm.message}
                    onChange={handleChange}
                    className="w-full mb-2 border p-2 rounded"
                  />
                  <label className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="important"
                      checked={editForm.important}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Mark as Important
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(notice._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{notice.title}</h3>
                  <p className="text-sm text-gray-700">{notice.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on: {new Date(notice.date).toLocaleString()}
                  </p>
                  {role === "admin" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(notice._id);
                          setEditForm({
                            title: notice.title,
                            message: notice.message,
                            important: notice.important,
                          });
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Notices;
