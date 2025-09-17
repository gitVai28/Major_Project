import axios from "./axiosConfig";

// Get Profile
export const getProfile = async () => {
  const res = await axios.get("/dashboard/user");
  return res.data;
};

// Update Profile
export const updateProfile = async (data) => {
  const res = await axios.put("/dashboard/user", data);
  return res.data;
};

// Upload Profile Photo
export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await axios.post("/dashboard/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete Profile
export const deleteProfile = async () => {
  const res = await axios.delete("/dashboard/user");
  return res.data;
};

// Toggle Role
export const toggleRole = async (role) => {
  const res = await axios.post("/dashboard/toggle-role", { role });
  return res.data;
};

export default {
  getProfile,
  updateProfile,
  uploadPhoto,
  deleteProfile,
  toggleRole,
};
