import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";

function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit new or edited complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting complaint:", formData);
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/complaints/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/complaints",
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }

      // Refresh complaints
      await fetchComplaints();
      setFormData({ title: "", description: "", date: "" });
      setEditId(null);
    } catch (error) {
      console.error("Error submitting complaint:", error.response?.data || error.message);
      alert("Failed to submit complaint! Check console.");
    }
  };

  // ✅ Delete complaint
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(complaints.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error.response?.data?.error || error.message);
    }
  };

  // ✅ Edit complaint
  const handleEdit = (complaint) => {
    setEditId(complaint._id);
    setFormData({
      title: complaint.title,
      description: complaint.description,
      date: complaint.date,
    });
  };

  // ✅ Filter complaints by search
  const filteredComplaints = complaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <p>Loading Complaints...</p>
      ) : (
        <div className="min-h-screen bg-gray-100">
          <Sidebar />
          <Header />
          <main className="ml-64 p-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Complaints</h2>

            {editId && (
              <p className="mb-2 text-sm text-yellow-600 font-medium">
                ✏️ You are editing complaint #{editId.slice(-4)}
              </p>
            )}

            {/* 🔍 Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded w-full sm:w-1/3"
              />
            </div>

            {/* 📋 Add Complaint Form (Residents Only) */}
            {user?.role === "resident" && (
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-white p-6 rounded-xl shadow"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
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
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                />
                <button
                  type="submit"
                  className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editId ? "Update Complaint" : "Submit Complaint"}
                </button>
              </form>
            )}

            {/* 📄 Complaints Table */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Posted By</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((c) => {
                      const isResidentOwner =
                        user?.role === "resident" &&
                        String(user._id) === String(c.userId?._id);

                      const isAdminDeletable =
                        user?.role === "admin" && c.resolved;

                      return (
                        <tr key={c._id} className="border-b">
                          <td className="px-6 py-4">{c.title}</td>
                          <td className="px-6 py-4">{c.description}</td>
                          <td className="px-6 py-4">{c.date}</td>
                          <td className="px-6 py-4">{c.userId?.name || "Unknown"}</td>
                          <td className="px-6 py-4 space-x-2">
                            {isResidentOwner ? (
                              <>
                                <button
                                  onClick={() => handleEdit(c)}
                                  className="bg-yellow-400 text-white px-3 py-1 text-xs rounded hover:bg-yellow-500 mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(c._id)}
                                  className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                                >
                                  Delete
                                </button>
                              </>
                            ) : isAdminDeletable ? (
                              <button
                                onClick={() => handleDelete(c._id)}
                                className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No complaints found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default Complaints;
