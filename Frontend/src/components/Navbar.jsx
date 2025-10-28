import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import { Bell } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  // 🟣 Frontend-only role toggle
  const handleRoleSwitch = () => {
    const newRole = user.role === "participant" ? "organizer" : "participant";
    const updatedUser = { ...user, role: newRole };

    login(updatedUser, localStorage.getItem("token")); // update context + localStorage
    alert(`Switched to ${newRole} mode`);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-purple-600">🎟️ EventHub</span>
          <div className="hidden md:flex gap-6 ml-8 text-gray-700 font-medium">
            <Link to="/dashboard" className="hover:text-purple-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/explore" className="hover:text-purple-600 transition-colors">
              Explore
            </Link>
            <Link to="/applications" className="hover:text-purple-600 transition-colors">
              My Applications
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Role toggle */}
          <button
            onClick={handleRoleSwitch}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            Switch to {user.role === "participant" ? "Organizer" : "Participant"}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-2xl p-4 z-50 border border-gray-100">
                <p className="font-semibold text-gray-700 mb-3">Notifications</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="bg-purple-50 p-2 rounded-xl">
                    🎤 You're selected as Anchor for Cultural Fest!
                  </li>
                  <li className="bg-purple-50 p-2 rounded-xl">
                    💃 New role posted: Dance Choreographer
                  </li>
                  <li className="bg-purple-50 p-2 rounded-xl">
                    ⏰ Reminder: Interview tomorrow at 3 PM
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
              {user.name?.charAt(0) || "U"}
            </div>
            <span className="font-semibold text-gray-800 hidden sm:block">
              {user.name || "Profile"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 font-medium ml-2"
          >
            Logout
          </button>
        </div>
      </div>

      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </nav>
  );
}
