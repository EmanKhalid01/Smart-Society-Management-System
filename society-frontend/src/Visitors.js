import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [formData, setFormData] = useState({ name: "", purpose: "", date: "", time: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);

  const { user } = useAuth();
  const role = user?.role; // Default to guest if no user
  const token = localStorage.getItem("token"); // assuming you store JWT

  // Fetch visitors from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/visitors", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVisitors(res.data))
      .catch(() => toast.error("❌ Failed to fetch visitors"));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios.put(`http://localhost:5000/api/visitors/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setVisitors(visitors.map((v) => (v._id === editId ? res.data : v)));
          toast.success("✅ Visitor updated!");
          setEditId(null);
          setFormData({ name: "", purpose: "", date: "", time: "" });
        })
        .catch(() => toast.error("❌ Failed to update visitor"));
    } else {
      axios.post("http://localhost:5000/api/visitors", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setVisitors([res.data, ...visitors]);
          toast.success("✅ Visitor added!");
          setFormData({ name: "", purpose: "", date: "", time: "" });
        })
        .catch(() => toast.error("❌ Failed to add visitor"));
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/visitors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setVisitors(visitors.filter((v) => v._id !== id));
        toast.success("❌ Visitor deleted!");
      })
      .catch(() => toast.error("❌ Failed to delete visitor"));
  };

  const handleEdit = (visitor) => {
    setEditId(visitor._id);
    setFormData({
      name: visitor.name,
      purpose: visitor.purpose,
      date: visitor.date,
      time: visitor.time,
    });
  };

  const filteredVisitors = visitors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Visitor Management</h2>

        <input
          type="text"
          placeholder="Search visitors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-4 border rounded w-full sm:w-1/3"
        />

        {role === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow mb-6"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Purpose"
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
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update Visitor" : "Add Visitor"}
          </button>
        </form>
        )}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Purpose</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((v) => (
                  <tr key={v._id} className="border-b">
                    <td className="px-6 py-4">{v.name}</td>
                    <td className="px-6 py-4">{v.purpose}</td>
                    <td className="px-6 py-4">{v.date}</td>
                    <td className="px-6 py-4">{v.time}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(v)}
                        className="bg-yellow-400 text-white px-3 py-1 text-xs rounded hover:bg-yellow-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No visitors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Visitors;
