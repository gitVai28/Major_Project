import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    if (location.state?.email && location.state?.password) {
      setEmail(location.state.email);
      setPassword(location.state.password);
    } else {
      navigate("/login");
    }
  }, [location.state, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await api.verifyEmail({ email, otp });

      const res = await api.login({ email, password });
      login({ email }, res.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-10">
      <form
        onSubmit={handleVerify}
        className="bg-white/95 backdrop-blur-md p-20 rounded-3xl shadow-2xl w-full max-w-5xl border border-gray-200"
      >
        <h2 className="text-8xl font-extrabold text-center mb-12 text-pink-700 drop-shadow-lg">
          Verify Your Email ✉️
        </h2>
        <p className="text-center text-gray-700 mb-14 text-4xl">
          Enter the OTP sent to <b className="text-pink-600">{email}</b>
        </p>

        <div className="space-y-12">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-8 border border-gray-300 rounded-3xl text-4xl focus:ring-4 focus:ring-pink-400 focus:outline-none shadow-md tracking-widest text-center"
            required
          />

          <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-7 rounded-3xl font-extrabold text-4xl hover:scale-105 transform transition duration-300 shadow-2xl">
            Verify & Login
          </button>
        </div>
      </form>
    </div>
  );
}
