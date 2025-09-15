import axios from "./axiosConfig";

// Login
export const login = async (data) => {
  const res = await axios.post("/users/login", data); // matches your backend
  return res.data; // should return { token, isVerified }
};

// Register
export const register = async (data) => {
  const res = await axios.post("/users/register", data);
  return res.data;
};

// Verify Email
export const verifyEmail = async (data) => {
  const res = await axios.post("/users/verify-email", data);
  return res.data;
};

export default {
  login,
  register,
  verifyEmail,
};
