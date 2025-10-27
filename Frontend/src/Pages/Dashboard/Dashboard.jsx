import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getUserProfile,
  uploadProfilePhoto,
  updateUserProfile,
  deleteUserProfile,
  toggleRole,
} from "../../api/userApi";

import ParticipantDashboard from "./ParticipantDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import InfoRow from "../../components/InfoRow";

export default function Dashboard() {
  const { user, setUser, token, logout } = useAuth();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && token) loadProfile();
  }, [user, token]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      if (data.profilePhoto && !data.profilePhoto.startsWith("http")) {
        data.profilePhoto = `http://localhost:5000${data.profilePhoto}`;
      }
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleUploadPhoto = async () => {
    if (!profileImage) return alert("Please select a photo first!");
    try {
      const res = await uploadProfilePhoto(profileImage);
      const fullPhotoUrl = res.photoUrl.startsWith("http")
        ? res.photoUrl
        : `http://localhost:5000${res.photoUrl}`;

      const updatedUser = { ...user, profilePhoto: fullPhotoUrl };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert(res.message);
      setProfileImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  const handleToggleRole = async () => {
    if (!token) return alert("User not authenticated!");
    try {
      setIsToggling(true);
      const newRole = user?.isOrganizer ? "participant" : "organizer";
      const res = await toggleRole(newRole, token); // pass token here
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      alert(res.message);
    } catch (error) {
      console.error(error);
      alert("Role toggle failed");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await deleteUserProfile();
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-2 text-purple-600 font-bold text-2xl">
            🏆 EventHub
          </div>
          <ul className="flex items-center space-x-6 text-lg font-medium">
            <li>
              <button onClick={() => setShowProfile(false)} className="hover:text-purple-600">
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={handleToggleRole}
                disabled={isToggling}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Switch to {user?.isOrganizer ? "Participant" : "Organizer"}
              </button>
            </li>
            <li>
              <button className="p-2 rounded-full hover:bg-gray-100">🔔</button>
            </li>
            <li>
              <button onClick={() => setShowProfile(true)}>
                <img
                  src={user?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
            </li>
            <li>
              <button
                onClick={logout}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {!showProfile ? (
          user?.isOrganizer ? (
            <OrganizerDashboard />
          ) : (
            <ParticipantDashboard />
          )
        ) : (
          <>
            {/* Profile Page */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={previewUrl || user?.profilePhoto || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
                />
                <div>
                  <h2 className="text-2xl font-bold">My Profile</h2>
                  <p className="text-gray-600">Manage your account details</p>
                </div>
              </div>

              {/* Upload */}
              <div className="flex gap-3 mb-6">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Select Photo
                </button>
                <button
                  onClick={handleUploadPhoto}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Upload
                </button>
              </div>

              {/* Editable Info */}
              <InfoRow
                label="Name"
                value={user?.name}
                onSave={(val) => updateUserProfile({ name: val })}
              />
              <InfoRow label="Email" value={user?.email} readOnly />
              <InfoRow label="Skills" value={user?.skills?.join(", ")} />
              <InfoRow label="Interests" value={user?.interests?.join(", ")} />

              {/* Danger Zone */}
              <div className="mt-6 border-t pt-4">
                <button
                  onClick={handleDeleteProfile}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
