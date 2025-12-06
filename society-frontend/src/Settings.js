import React, { useState, useEffect } from "react";
import axios from "axios";

function Settings() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/settings/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile photo URL from backend:", res.data.profilePhoto);

        setFormData({ name: res.data.name, password: "", confirmPassword: "" });
        if (res.data.profilePhoto) {
          setPreview(res.data.profilePhoto); // backend sends full URL
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(URL.createObjectURL(file)); // instant preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSuccessMsg("❌ Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.password) data.append("password", formData.password);
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const res = await axios.put("/api/settings/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(res.data.message);
      setFormData({ ...formData, password: "", confirmPassword: "" });

      if (res.data.profilePhoto) {
        setPreview(res.data.profilePhoto);
        setProfilePhoto(null);
      }
      console.log("Profile photo URL from backend:", res.data.profilePhoto);
    } catch (err) {
      console.error("Error updating profile:", err);
      setSuccessMsg("❌ Failed to update profile!");
    }
  };

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Settings</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-xl"
      >
        {/* Profile Photo */}
        <div className="mb-6 flex items-center space-x-4">
          <img
            src={preview || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            name="password"
            className="w-full border rounded p-2"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border rounded p-2"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>

        {successMsg && (
          <p className="mt-4 text-sm font-medium">
            {successMsg.startsWith("❌") ? (
              <span className="text-red-600">{successMsg}</span>
            ) : (
              <span className="text-green-600">{successMsg}</span>
            )}
          </p>
        )}
      </form>
    </div>
  );
}

export default Settings;
