import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/userApi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.register(form);
      navigate("/verify-email", {
        state: { email: form.email, password: form.password },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-10">
      <form
        onSubmit={handleRegister}
        className="bg-white/95 backdrop-blur-md p-20 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-200"
      >
        <h2 className="text-7xl font-extrabold text-center mb-12 text-purple-700 drop-shadow-lg">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-700 mb-14 text-4xl">
          Join <span className="font-bold text-purple-600">Smart Event Buddy</span> today!
        </p>

        <div className="space-y-12">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-purple-400 focus:outline-none shadow-md"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-purple-400 focus:outline-none shadow-md"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-purple-400 focus:outline-none shadow-md"
            required
          />

          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white p-7 rounded-3xl font-extrabold text-4xl hover:scale-105 transform transition duration-300 shadow-2xl">
            Register
          </button>
        </div>

        <p className="text-center mt-12 text-gray-800 text-3xl">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-purple-600 font-extrabold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
