import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./context/AuthContext"; // Import AuthContext

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      login(res.data.user, res.data.token);     // Save user data in AuthContext
      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };
   useEffect(() => {
  const token = localStorage.getItem("token");
  // Redirect only if we are on login page AND token exists AND NOT after logout
  if (token && window.location.pathname === "/") {
    navigate("/dashboard");
  }
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>

 <form onSubmit={handleLogin}>
   <div className="mb-4">
    <label className="block mb-1 text-gray-700">Email</label>
    <input
      type="email"
      className="w-full px-4 py-2 border rounded-md"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>
   <div className="mb-6">
    <label className="block mb-1 text-gray-700">Password</label>
    <input
      type="password"
      className="w-full px-4 py-2 border rounded-md"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  <button
    type="submit"
    className="w-full py-2 bg-blue-600 text-white rounded-md">
    Login
  </button>

  <p className="mt-4 text-center text-sm">
    Don't have an account?{" "}
    <Link to="/register" className="text-blue-500 underline">Register</Link>
  </p>
</form>
      </div>
    </div>
  );
}

export default Login;
