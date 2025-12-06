import React, { useState, useEffect} from "react";
import axios from "axios";
import { useAuth } from "./context/AuthContext"; // ✅ Import useAuth to access user and token
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

function Residents() {
  console.log("✅ Residents component loaded");
const { user, token } = useAuth(); // ✅ Get user & token from context
const role = user?.role;
const currentUserId = user?._id;

  // State to store all residents
const [residents, setResidents] = useState([]);
const [formData, setFormData] = useState({
    name: "",
    apartment: "",
    contact: "",
  });
const [editingId, setEditingId] = useState(null); 
const [editForm, setEditForm] = useState({ name: "", apartment: "", contact: "" });
const [searchTerm, setSearchTerm] = useState("");   

useEffect(() => {
  // Example in Residents.js
axios.get("http://localhost:5000/api/residents", {
  headers: { Authorization: `Bearer ${token}`},
})
    .then((res) => setResidents(res.data))
    .catch((err) => console.error("GET error:", err));
}, []);

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/residents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Update UI
    setResidents(residents.filter((resident) => resident._id !== id));
  } catch (err) {
    console.error("❌ Delete Error:", err.response?.data || err.message);
  }
};

  // Handle form submit
const handleSubmit = (e) => { 
  e.preventDefault();
  console.log("📤 Form Data Submitted:");  // Log 1
  if (!formData.name || !formData.apartment || !formData.contact) return;
  console.log("📦 Sending data:", formData); // ✅ Log 3
  axios.post("http://localhost:5000/api/residents", 
    {...formData, user: user._id}, // Add userId: user
    {
    headers: {
      Authorization: `Bearer ${token}`}
    })
    .then((res) => {
      console.log("✅ POST Response:", res.data); // Log 4
      setResidents((prev) => [res.data, ...prev]); // Add new resident to the top
      setFormData({ name: "", apartment: "", contact: "" });
    })
    .catch((err) => {
      console.error("❌ POST Error:", err.response?.data || err.message); // ✅ Log 5
    });
};
  
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <Header />
        <main className="ml-64 p-6">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Residents List</h2>
  {console.log("🔄 Component rendering")}
      {/* 🔍 Search Residents */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full sm:w-1/3"
      />
      {/* 📝 Add Resident Form */}
      {role === "admin" && (
<form onSubmit={handleSubmit}
         className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
  <input
    type="text"
    name="name"
    placeholder="Name"
    value={formData.name}
    onChange={handleChange}
    className="border p-2 rounded"
    required/>
  <input
    type="text"
    name="apartment"
    placeholder="Apartment #"
    value={formData.apartment}
    onChange={handleChange}
    className="border p-2 rounded"
    required/>
  <input
    type="text"
    name="contact"
    placeholder="Contact"
    value={formData.contact}
    onChange={handleChange}
    className="border p-2 rounded"
    required/>
  <button
    type="submit" // ✅ here’s the fix
    className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
    Add Resident
  </button>
</form>
      )}
      {/* 📋 Residents Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Apartment</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
           {residents.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
           .map((resident) => (
              <tr key={resident._id} className="border-b">
                <td className="px-6 py-4">
  {editingId === resident._id ? (
    <input
      type="text"
      name="name"
      value={editForm.name}
      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
      className="border p-1 rounded"
    />
  ) : (
    resident.name
  )}
</td>
<td className="px-6 py-4">
  {editingId === resident._id ? (
    <input
      type="text"
      name="apartment"
      value={editForm.apartment}
      onChange={(e) => setEditForm({ ...editForm, apartment: e.target.value })}
      className="border p-1 rounded"
    />
  ) : (
    resident.apartment
  )}
</td>
<td className="px-6 py-4">
  {editingId === resident._id ? (
    <input
      type="text"
      name="contact"
      value={editForm.contact}
      onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
      className="border p-1 rounded"
    />
  ) : (
    resident.contact
  )}
</td>
<td className="px-6 py-4">
  {/* Actions: Edit/Save and Delete */}
  {editingId === resident._id ? (
    <>
      <button
  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
  onClick={async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/residents/${resident._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setResidents(residents.map((r) =>
        r._id === resident._id ? res.data : r
      ));
      setEditingId(null);
    } catch (err) {
      console.error("❌ Edit Error:", err.response?.data || err.message);
    }
  }}
>
  Save
</button>
      <button
        className="bg-gray-400 text-white px-2 py-1 rounded"
        onClick={() => setEditingId(null)} >
        Cancel
      </button>
    </>
  ) : (
    <>
    {role === "admin" || String(resident.user?._id) === String(currentUserId) ? (
  <>
      <button
        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
        onClick={() => {
          setEditingId(resident._id);
          setEditForm({
            name: resident.name,
            apartment: resident.apartment,
            contact: resident.contact,
          });
        }}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded"
        onClick={() => handleDelete(resident._id)} > 
        Delete
      </button>
    </>
) : (
  <span className="text-gray-500">No Actions</span>
  )}
    </>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
}

export default Residents;



