import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getUserProfile,
  uploadProfilePhoto,
  updateUserProfile,
  deleteUserProfile,
  toggleRole,
} from "../api/userApi";

export default function Dashboard() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showProfileFeatures, setShowProfileFeatures] = useState(false);

  // new: toggling state to prevent double-clicks
  const [isToggling, setIsToggling] = useState(false);

  // Fetch latest profile
  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getUserProfile();
      setUser(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
    setLoadingProfile(false);
  };

  const handleUploadPhoto = async () => {
    if (!profileImage) return alert("Please select a photo first!");
    try {
      const res = await uploadProfilePhoto(profileImage);
      alert(res.message);
      setUser((prev) => ({ ...prev, profilePhoto: res.photoUrl }));
      setProfileImage(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const res = await updateUserProfile({ ...user, ...updates });
      alert(res.message);
      setUser(res.user);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      const res = await deleteUserProfile();
      alert(res.message);
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // ---------- UPDATED: toggle role handler ----------
  const handleToggleRole = async () => {
  try {
    const newRole = user?.isOrganizer === true ? "participant" : "organizer";
    console.log("Toggling role to:", newRole);

    const res = await toggleRole(newRole);
    console.log("Response:", res);
    alert(res.message);
    setUser(res.user);
  } catch (error) {
    console.error("Toggle role frontend error:", error.response || error);
    alert(error.response?.data?.message || "Role toggle failed");
  }
};


  // ---------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-[150rem] mx-auto w-full px-6 md:px-8 py-10 flex justify-between items-center">
          <div
            className="text-4xl md:text-5xl font-extrabold text-blue-800 cursor-pointer"
            onClick={() => setShowProfileFeatures(false)}
          >
            🏆 Smart Event Buddy
          </div>
          <ul className="flex flex-wrap space-x-8 md:space-x-6 items-center text-3xl font-bold gap-10">
            <li>
              <button
                className={`px-4 py-4 rounded-lg transition ${
                  !showProfileFeatures
                    ? "bg-indigo-600 text-white"
                    : "text-blue-800 hover:text-indigo-500"
                }`}
                onClick={() => setShowProfileFeatures(false)}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button className="text-blue-800 hover:text-blue-500">
                Explore
              </button>
            </li>
            <li>
              <button className="text-blue-800 hover:text-blue-500">
                My Applications
              </button>
            </li>
            <li>
              <button
                onClick={handleToggleRole}
                disabled={isToggling}
                className="px-4 py-4 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition disabled:opacity-60"
              >
                {/* text unchanged; button is briefly disabled while request runs */}
                Switch to {user?.isOrganizer ? "Participant" : "Organizer"}
              </button>
            </li>
            <li>
              <button
                onClick={() => setShowProfileFeatures(true)}
                className="flex items-center justify-center w-15 h-15 rounded-full bg-gray-100 hover:bg-indigo-100 transition"
              >
                <img
                  src={user?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
            </li>
            <li>
              <button
                className="ml-4 text-red-500 font-semibold hover:underline"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Container (like Home.jsx) */}
      <div className="max-w-[150rem] mx-auto w-full px-6 md:px-8 py-10 flex flex-col flex-1">
        {/* Welcome Banner */}
        {!showProfileFeatures && (
          <section className="py-16">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl shadow-2xl p-16 flex justify-between items-center min-h-[600px]">
              {/* Left */}
              <div className="flex flex-col justify-center max-w-7xl">
                <h1 className="text-7xl font-extrabold mb-6">
                  Welcome back, {user?.name || "User"} 🎉
                </h1>
                <p className="text-4xl mb-10 opacity-90">
                  You're currently in{" "}
                  <span className="font-semibold">
                    {user?.isOrganizer ? "Organizer" : "Participant"}
                  </span>{" "}
                  mode. Explore opportunities and showcase your talents!
                </p>
                <div className="flex gap-6 text-3xl">
                  <button className="bg-white text-indigo-700 px-12 py-7 rounded-xl font-semibold hover:bg-gray-100 transition">
                    Explore Events
                  </button>
                  <button className="bg-indigo-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-800 transition">
                    Open Messages
                  </button>
                </div>
              </div>

              {/* Right (Profile Image) */}
              <div className="flex-shrink-0">
                <img
                  src={user?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-90 h-90 rounded-full border-4 border-white object-cover shadow-2xl"
                />
              </div>
            </div>
          </section>
        )}

        {/* Profile Page */}
        {showProfileFeatures && (
          <section className="py-40 max-w-7xl mx-auto w-full">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 space-y-10">
              {/* Header */}
              <div className="flex items-center gap-8">
                <img
                  src={user?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-42 h-42 rounded-full border-4 border-indigo-600 object-cover shadow-lg"
                />
                <div className="flex flex-col gap-3">
                  <h1 className="text-6xl font-extrabold text-indigo-700">
                    My Profile
                  </h1>
                  <p className="text-gray-600 text-3xl">
                    Manage your account details here ✨
                  </p>
                </div>
              </div>

              <div className="space-y-8 text-2xl">
                <InfoRow
                  label="Name"
                  value={user?.name}
                  placeholder="Enter new name"
                  onSave={(val) => handleUpdateProfile({ name: val })}
                />
                <InfoRow label="Email" value={user?.email} readOnly />
                <InfoRow
                  label="Skills"
                  value={user?.skills?.join(", ")}
                  placeholder="Enter skills (comma separated)"
                  onSave={(val) =>
                    handleUpdateProfile({
                      skills: val.split(",").map((s) => s.trim()),
                    })
                  }
                />
                <InfoRow
                  label="Interests"
                  value={user?.interests?.join(", ")}
                  placeholder="Enter interests (comma separated)"
                  onSave={(val) =>
                    handleUpdateProfile({
                      interests: val.split(",").map((i) => i.trim()),
                    })
                  }
                />
              </div>

              {/* Danger Zone */}
              <div className="mt-12 p-6 border-2 border-red-400 rounded-2xl bg-red-50">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  ⚠️ Danger Zone
                </h2>
                <p className="text-gray-700 text-2xl mb-6">
                  Deleting your account is permanent and cannot be undone.
                </p>
                <button
                  onClick={handleDeleteProfile}
                  className="bg-red-500 text-white text-2xl px-8 py-3 rounded-xl hover:bg-red-600 transition font-semibold"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* Reusable inline edit component */
function InfoRow({ label, value, readOnly, placeholder, onSave }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  const handleSave = async () => {
    if (onSave) await onSave(tempValue);
    setEditing(false);
  };

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <span className="text-xl font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-4">
        {editing ? (
          <>
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className="border border-gray-300 px-4 py-2 rounded-lg w-64"
            />
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-600 text-lg">{value || "Not set"}</span>
            {!readOnly && (
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
