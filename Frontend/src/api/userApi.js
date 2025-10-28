// src/api/userApi.js
import api from "./axiosConfig";

// 🧹 Helper to clean arrays or stringified arrays properly
const cleanArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value))
    return value.map((v) => v.toString().replace(/[\[\]"']/g, "").trim());

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map((v) => v.toString().replace(/[\[\]"']/g, "").trim());
    }
  } catch {}

  return value
    .toString()
    .replace(/[\[\]"']/g, "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

// ---------------------- AUTH APIs ----------------------
export const login = async (data) => {
  const res = await api.post("/users/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await api.post("/users/register", data);
  return res.data;
};

export const verifyEmail = async (data) => {
  const res = await api.post("/users/verify-email", data);
  return res.data;
};

// ---------------------- PROFILE APIs ----------------------
export const getUserProfile = async () => {
  const res = await api.get("/home/me");
  const user = res.data;

  user.skills = cleanArray(user.skills);
  user.interests = cleanArray(user.interests);

  if (user.profilePhoto && !user.profilePhoto.startsWith("http")) {
    user.profilePhoto = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    }${user.profilePhoto}`;
  }

  return user;
};

// ✅ Always send FormData correctly for file + arrays
export const updateUserProfile = async (data) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (Array.isArray(data.skills))
    formData.append("skills", JSON.stringify(data.skills));
  if (Array.isArray(data.interests))
    formData.append("interests", JSON.stringify(data.interests));
  if (data.profilePhoto && data.profilePhoto instanceof File)
    formData.append("profilePhoto", data.profilePhoto);

  const res = await api.put("/home/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const updatedUser = res.data;
  updatedUser.skills = cleanArray(updatedUser.skills);
  updatedUser.interests = cleanArray(updatedUser.interests);

  if (updatedUser.profilePhoto && !updatedUser.profilePhoto.startsWith("http")) {
    updatedUser.profilePhoto = `${
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    }${updatedUser.profilePhoto}`;
  }

  return updatedUser;
};

// ---------------------- DELETE ACCOUNT ----------------------
export const deleteUserProfile = async () => {
  const res = await api.delete("/home/me");
  return res.data;
};

// ---------------------- ROLE TOGGLE ----------------------
export const toggleRole = async (newRole) => {
  try {
    // match exactly what your test.html sends
    const response = await api.put("/home/toggle-role", { role: newRole });
    return response.data; // backend sends { user, message }
  } catch (error) {
    console.error("Error toggling role:", error);
    throw error;
  }
};

// Default export for convenience
export default {
  login,
  register,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  toggleRole,
};
