import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import axios from "axios";
import { useAuth } from "./context/AuthContext";

const MAX_SLOTS = 10;

function Parking() {
  const [toast, setToast] = useState(null);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({ slot: "", resident: "", vehicle: "" });
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const role = user?.role; // Default to guest if no user
  const token = localStorage.getItem("token") || "";

  // Fetch slots from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/parking", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setSlots(res.data))
      .catch((err) => showToast(`❌ Failed to fetch slots: ${err.message}`))
      .finally(() => setLoading(false));
  }, [token]);

  const totalAllocated = slots.length;
  const availableSlots = MAX_SLOTS - totalAllocated;

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slot.trim() || !formData.resident.trim() || !formData.vehicle.trim()) {
      showToast("❌ All fields are required!");
      return;
    }
    if (editId === null && totalAllocated >= MAX_SLOTS) {
      showToast("❌ All parking slots are full!");
      return;
    }

    setSubmitting(true);
    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/parking/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlots((prev) => prev.map((s) => (s._id === editId ? res.data : s)));
        showToast("✅ Slot updated!");
        setEditId(null);
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/parking",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSlots((prev) => [res.data, ...prev]);
        showToast("✅ Slot added!");
      }
      setFormData({ slot: "", resident: "", vehicle: "" });
    } catch (err) {
      showToast(`❌ ${err.response?.data?.error || "Error saving slot"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (slot) => {
    setEditId(slot._id);
    setFormData({ slot: slot.slot, resident: slot.resident, vehicle: slot.vehicle });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/parking/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots((prev) => prev.filter((s) => s._id !== id));
      showToast("❌ Slot deleted!");
    } catch (err) {
      showToast("❌ Error deleting slot");
    }
  };

  const filteredSlots = slots.filter(
    (s) =>
      s.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Parking Allocation</h2>

        {toast && (
          <div
            className={`mb-4 p-3 rounded shadow ${
              toast.type === "error"
                ? "bg-red-100 text-red-800"
                : toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Allocated" value={totalAllocated} color="blue" />
          <StatCard title="Available Slots" value={availableSlots} color="green" />
          <StatCard title="Maximum Slots" value={MAX_SLOTS} color="gray" />
        </div>

        {editId && (
          <p className="mb-2 text-yellow-600 text-sm font-medium">✏️ Editing Parking Slot</p>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search by resident or vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded mb-4 w-full sm:w-1/3"
        />

        {/* Form */}
        {role === "admin" && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-xl shadow"
          >
            <input
              type="text"
              name="slot"
              placeholder="Slot #"
              value={formData.slot}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="resident"
              placeholder="Resident Name"
              value={formData.resident}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="vehicle"
              placeholder="Vehicle Number"
              value={formData.vehicle}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className={`col-span-full py-2 rounded text-white ${
                submitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "Saving..." : editId ? "Update Slot" : "Allocate Slot"}
            </button>
          </form>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <p className="text-center py-6 text-gray-500">Loading slots...</p>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3">Slot</th>
                  <th className="px-6 py-3">Resident</th>
                  <th className="px-6 py-3">Vehicle</th>
                  {role === "admin" && <th className="px-6 py-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((s) => (
                    <tr key={s._id} className="border-b">
                      <td className="px-6 py-4">{s.slot}</td>
                      <td className="px-6 py-4">{s.resident}</td>
                      <td className="px-6 py-4">{s.vehicle}</td>
                      {role === "admin" && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEdit(s)}
                            className="bg-yellow-400 text-white px-3 py-1 text-xs rounded hover:bg-yellow-500 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={role === "admin" ? "4" : "3"}
                      className="text-center py-4 text-gray-500"
                    >
                      No parking slots found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-700",
    green: "text-green-700",
    gray: "text-gray-600"
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <h3 className={`text-lg font-semibold ${colors[color]}`}>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Parking;
