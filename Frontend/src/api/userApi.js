import api from "./axiosConfig";

// Authentication APIs
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

// Dashboard APIs
export const getUserProfile = async () => {
  const res = await api.get("/dashboard/user");
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.put("/dashboard/user", data);
  return res.data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/dashboard/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteUserProfile = async () => {
  const res = await api.delete("/dashboard/user");
  return res.data;
};

// Role toggle
export const toggleRole = async (role) => {
  const res = await api.put("/dashboard/toggle-role", { role });
  return res.data;
};

export default {
  login,
  register,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  deleteUserProfile,
  toggleRole,
};
