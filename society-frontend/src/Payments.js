import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    date: "",
    status: "Paid",
    purpose: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    amount: "",
    date: "",
    status: "Paid",
    purpose: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch payments
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchPayments();
    }, []);
    // Handle input change
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  // Add Payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting payment:", formData);
    try {
      if (editingId) {
        await axios.put( `http://localhost:5000/api/payments/${editingId}`,
          editForm,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post( "http://localhost:5000/api/payments",
          formData,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      // Optionally, refresh payments after submit
      fetchPayments();
      setFormData({
        name: "",
        amount: "",
        date: "",
        status: "Paid",
        purpose: "",
      });
      setEditingId(null);
      setEditForm({
        name: "",
        amount: "",
        date: "",
        status: "Paid",
        purpose: "",
      });
      toast.success(editingId ? "Payment updated" : "Payment added");
    } catch (error) {
      console.error("Error submitting payment:", error.response?.data || error.message);
      toast.error("Failed to submit payment");
    }
  };

  // Delete Payment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPayments(payments.filter((p) => p._id !== id));
      toast.success("Payment deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete payment");
    }
  };

  // Save Edited Payment
  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/payments/${editingId}`,
        editForm,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const updatedPayments = payments.map((p) =>
        p._id === editingId ? res.data : p
      );
      setPayments(updatedPayments);
      setEditingId(null);
      toast.success("Payment updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment");
    }
  };

  return (
    <>
    {loading ? (
      <p>Loading Payments...</p>
    ) : (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <Header />
      <main className="ml-64 p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Payments</h2>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-blue-600">
              Total Payments
            </h3>
            <p className="text-2xl font-bold">{payments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-green-600">Paid</h3>
            <p className="text-2xl font-bold">
              {payments.filter((p) => p.status === "Paid").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-red-500">Pending</h3>
            <p className="text-2xl font-bold">
              {payments.filter((p) => p.status === "Pending").length}
            </p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or purpose"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded w-full sm:w-1/3"
        />

        {/* Add Payment Form */}
        {user?.role === "resident" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-1 sm:grid-cols-5 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
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
              name="purpose"
              placeholder="Purpose (e.g. Event)"
              value={formData.purpose}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option>Paid</option>
              <option>Pending</option>
            </select>
            <button
              type="submit"
              className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add Payment
            </button>
          </form>
        )}
        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments
                .filter((p) =>
                  `${p.name} ${p.purpose}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((p) => (
                  <tr key={p._id} className="border-b">
                    <td className="px-6 py-4">
                      {editingId === p._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === p._id ? (
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                          className="border p-1 rounded"
                        />
                      ) : (
                        `Rs ${p.amount}`
                      )}
                    </td>
                    <td className="px-6 py-4">{p.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          p.status === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === p._id ? (
                        <input
                          type="text"
                          value={editForm.purpose}
                          onChange={handleChange}
                          className="border p-1 rounded"
                        />
                      ) : (
                        p.purpose
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user?.role === "resident" && p.userId === user?._id ? (
                        editingId === p._id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(p._id);
                                setEditForm({
                                  name: p.name,
                                  amount: p.amount,
                                  date: p.date,
                                  status: p.status,
                                  purpose: p.purpose,
                                });
                              }}
                              className="bg-yellow-500 text-white px-3 py-1 rounded text-xs mr-2 hover:bg-yellow-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </>
                        )
                      ) : (
                        <span className="text-gray-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
    )}
    </>
  );
}

export default Payments;
