import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/userApi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.register(form); // backend sends OTP to email
      // Redirect to VerifyEmail page immediately after registration
      navigate("/verify-email", { state: { email: form.email, password: form.password } });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 px-4">
      <form onSubmit={handleRegister} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full p-4 border rounded-xl mb-4" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-4 border rounded-xl mb-4" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-4 border rounded-xl mb-6" required />

        <button className="w-full bg-indigo-500 text-white p-4 rounded-xl">Register</button>
      </form>
    </div>
  );
}
