import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(form);
      login({ email: form.email }, res.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-10">
      <form
        onSubmit={handleLogin}
        className="bg-white/95 backdrop-blur-md p-20 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-200"
      >
        <h2 className="text-8xl font-extrabold text-center mb-12 text-indigo-700 drop-shadow-lg">
          Welcome Back 🎉
        </h2>
        <p className="text-center text-gray-700 mb-14 text-4xl">
          Login to continue with{" "}
          <span className="font-bold text-indigo-600">Smart Event Buddy</span>
        </p>

        <div className="space-y-12">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-md"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-md"
            required
          />

          <button
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-7 rounded-3xl font-extrabold text-4xl hover:scale-105 transform transition duration-300 shadow-2xl"
          >
            Login
          </button>
        </div>

        <p className="text-center mt-12 text-gray-800 text-3xl">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-extrabold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
