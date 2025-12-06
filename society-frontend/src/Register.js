import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" ,role: "resident", apartment: "", contact: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("✅ Registration successful!");
      navigate("/"); // go to login page
    } catch (err) {
      alert(err.response?.data?.error || "❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Apartment Number</label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
 
          

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md">
            Register
          </button>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
