import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";
import { Bell } from "lucide-react";
import api from "../api/axiosConfig";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (!user) return null;

  // 🟣 Backend-integrated role toggle
  const handleRoleSwitch = async () => {
    try {
      setSwitching(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      // Determine new role
      const newRole = user.isOrganizer ? "participant" : "organizer";

      // Call backend API to toggle role
      const res = await api.put(
        "/home/toggle-role",
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        // Update user in context and localStorage
        const updatedUser = res.data.user || res.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success(
          `✅ Switched to ${updatedUser.isOrganizer ? "Organizer" : "Participant"} mode!`
        );

        // Refresh dashboard
        navigate("/dashboard", { replace: true });
        window.location.reload();
      }
    } catch (err) {
      console.error("Error toggling role:", err);
      toast.error(
        err.response?.data?.message || "Failed to switch role"
      );
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "🎤 You're selected as Anchor for Cultural Fest!",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "💃 New role posted: Dance Choreographer",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "⏰ Reminder: Interview tomorrow at 3 PM",
      time: "1 day ago",
    },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">🎟️</span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          <div className="hidden md:flex gap-6 ml-8 text-gray-700 font-medium">
            <Link
              to="/dashboard"
              className="hover:text-purple-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/explore"
              className="hover:text-purple-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/applications"
              className="hover:text-purple-600 transition-colors"
            >
              My Applications
            </Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Role toggle */}
          <button
            onClick={handleRoleSwitch}
            disabled={switching}
            className={`bg-gradient-to-r ${
              user.isOrganizer
                ? "from-purple-500 to-pink-500"
                : "from-green-400 to-emerald-500"
            } hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-semibold transition transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {switching
              ? "Switching..."
              : `Switch to ${user.isOrganizer ? "Participant" : "Organizer"}`}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:text-purple-600 transition rounded-full hover:bg-purple-50"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl p-4 z-50 border border-gray-100 animate-fadeIn">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-gray-800">Notifications</p>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="bg-purple-50 p-3 rounded-xl hover:bg-purple-100 transition cursor-pointer"
                      >
                        <p className="font-medium text-gray-800">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notif.time}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold shadow-md">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-gray-800 hidden sm:block">
              {user.name || "Profile"}
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}
    </nav>
  );
}