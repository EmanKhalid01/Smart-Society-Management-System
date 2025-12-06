import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold"> Dashboard </h1>

      {/* 🔽 Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <img
            src="/profile.png"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-800 dark:text-gray-200">
  <span>Dark Mode</span>
  <label className="relative inline-flex items-center cursor-pointer ml-2">
    <input
      type="checkbox"
      checked={darkMode}
      onChange={() => setDarkMode(!darkMode)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all"></div>
    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-transform" />
  </label>
</div>

            <button
  onClick={() => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }}
  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
>
  Log out
</button>
          </div>
        )}
      </div>
      
    </header>
  );
}

export default Header;
