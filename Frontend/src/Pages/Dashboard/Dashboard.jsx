import React from "react";
import Navbar from "../../components/Navbar";
import ParticipantDashboard from "./ParticipantDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import { useAuth } from "../../context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <main className="max-w-7xl mx-auto p-6">
        {user.isOrganizer ? (
          <OrganizerDashboard />
        ) : (
          <ParticipantDashboard />
        )}
      </main>
    </div>
  );
}