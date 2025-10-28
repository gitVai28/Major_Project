import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/VerifyEmail";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Explore from "./Explore";         // if you have this file
import Applications from "./Applications"; // if you have this file

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Note: Dashboard contains internal views (explore/applications) */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/applications" element={<Applications />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
