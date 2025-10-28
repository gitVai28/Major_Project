import React, { useState } from "react";
import { updateUserProfile, deleteUserProfile } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileModal({ user = {}, onClose = () => {} }) {
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();

  // 🧹 Utility to sanitize and clean input arrays
  const cleanArray = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((v) => v?.toString().replace(/[\[\]"']/g, "").trim())
          .filter(Boolean)
      : [];

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    skills: cleanArray(user.skills),
    interests: cleanArray(user.interests),
    profilePhoto: user.profilePhoto || null,
  });

  const [skillsText, setSkillsText] = useState(form.skills.join(", "));
  const [interestsText, setInterestsText] = useState(form.interests.join(", "));
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, profilePhoto: file });
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Convert textarea text → clean arrays
      const cleanedSkills = cleanArray(skillsText.split(","));
      const cleanedInterests = cleanArray(interestsText.split(","));

      const updated = await updateUserProfile({
        ...form,
        skills: cleanedSkills,
        interests: cleanedInterests,
      });

      if (updated?.user?.profilePhoto && !updated.user.profilePhoto.startsWith("http")) {
        updated.user.profilePhoto = `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
        }${updated.user.profilePhoto}`;
      }

      // 🧹 Clean again for local storage
      const cleanedUser = {
        ...(updated.user || updated),
        skills: cleanArray(updated.user?.skills || updated.skills),
        interests: cleanArray(updated.user?.interests || updated.interests),
      };

      setUser(cleanedUser);
      localStorage.setItem("user", JSON.stringify(cleanedUser));

      alert("Profile updated successfully!");
      setEditMode(false);
      onClose();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUserProfile();
      logout();
      setConfirmDelete(false);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return "/default-avatar.png";
    if (photo instanceof File) return URL.createObjectURL(photo);
    if (photo.startsWith("http")) return photo;
    return `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${photo}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" />

      <div className="fixed z-[9999] flex items-center justify-center w-screen h-screen">
        <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[480px] md:w-[520px] p-8 relative animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>

          {/* Avatar + Info */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative">
              <img
                src={getPhotoUrl(form.profilePhoto)}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 shadow-md"
              />
              {editMode && (
                <label
                  htmlFor="photoUpload"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer text-xs shadow-md"
                >
                  📷
                </label>
              )}
              <input
                type="file"
                id="photoUpload"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {editMode ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mt-4 border border-gray-300 rounded-lg px-3 py-2 w-3/4 text-center focus:outline-none focus:ring focus:ring-indigo-300"
              />
            ) : (
              <h2 className="text-2xl font-semibold mt-4">
                {form.name || "Your Name"}
              </h2>
            )}
            <p className="text-gray-500 text-sm">{form.email}</p>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
            {editMode ? (
              <textarea
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200"
                placeholder="Enter skills separated by commas"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {cleanArray(form.skills).map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Interests</h3>
            {editMode ? (
              <textarea
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-200"
                placeholder="Enter interests separated by commas"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {cleanArray(form.interests).map((i, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {i}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center mt-6 gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete Account
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:opacity-90"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-[10001] flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] sm:w-[400px] text-center animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Are you sure you want to delete your account?
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
