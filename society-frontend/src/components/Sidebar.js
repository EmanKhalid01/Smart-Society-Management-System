// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { Home, Users,  AlertTriangle, CreditCard, Newspaper, Car, UserCheck, CalendarDays, LogOut } from "lucide-react";
function Sidebar() {
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // ✅ Full page reload and redirect
};

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-blue-700 text-white flex flex-col shadow-lg">
    <div className="text-2xl font-bold p-6 border-b border-blue-500">Society Admin</div>
      <nav className="flex-1 p-4 space-y-4">
        <Link to="/dashboard" className="block hover:text-yellow-300">
        <Home className="inline-block mr-2" size={18} /> Dashboard
        </Link>
        <Link to="/residents" className="block hover:text-yellow-300">
            <Users className="inline-block mr-2" size={18} /> Residents
        </Link>
        <Link to="/payments" className="block hover:text-yellow-300">
            <CreditCard className="inline-block mr-2" size={18} /> Payments
        </Link>
        <Link to="/notices" className="block hover:text-yellow-300">
            <Newspaper className="inline-block mr-2" size={18} /> Notices
        </Link>
        <Link to="/complaints" className="block hover:text-yellow-300">
            <AlertTriangle className="inline-block mr-2" size={18} /> Complaints
        </Link>
        <Link to="/parking" className="block hover:text-yellow-300">
            <Car className="inline-block mr-2" size={18} /> Parking
        </Link>
        <Link to="/events" className="block hover:text-yellow-300">
            <CalendarDays className="inline-block mr-2" size={18} /> Events
        </Link>
        <Link to="/visitors" className="block hover:text-yellow-300">
            <UserCheck className="inline-block mr-2" size={18} /> Visitors
        </Link>
        </nav>
       <div className="p-4 border-t border-blue-500">
        {/* 🔴 Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-left text-white hover:text-red-600 hover:bg-red-100 rounded">
          <LogOut size={18} /> Log Out
        </button>
       </div>
     </div>
  );
}

export default Sidebar;
