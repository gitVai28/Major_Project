import axios from "./axiosConfig";

// -------- Existing --------
export const login = async (data) => {
  const res = await axios.post("/users/login", data);
  return res.data;
};
export const register = async (data) => {
  const res = await axios.post("/users/register", data);
  return res.data;
};
export const verifyEmail = async (data) => {
  const res = await axios.post("/users/verify-email", data);
  return res.data;
};

// -------- Dashboard APIs --------
export const getUserProfile = async () => {
  const res = await axios.get("/dashboard/user");
  return res.data;
};

// ✅ Updated uploadProfilePhoto
export const uploadProfilePhoto = async (formData) => {
  const res = await axios.post("/dashboard/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await axios.put("/dashboard/user", data);
  return res.data;
};

export const deleteUserProfile = async () => {
  const res = await axios.delete("/dashboard/user");
  return res.data;
};

export const toggleRole = async (role) => {
  const res = await axios.put("/dashboard/toggle-role", { role });
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
