import React from "react";
import Navbar from "./components/Navbar";

/**
 * Static "My Applications" page matching screenshot list style.
 */
export default function Applications() {
  const apps = [
    { title: "Anchor for Cultural Fest", meta: "Cultural Committee • Applied 3 days ago", status: "Open" },
    { title: "React Developer", meta: "Tech Club • Applied 1 day ago", status: "Pending" },
    { title: "Poster Designer", meta: "Design Club • Applied 1 week ago", status: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>

        <div className="bg-white rounded-2xl p-6 card-shadow">
          <div className="space-y-4">
            {apps.map((a, i) => (
              <div key={i} className="p-4 rounded-lg border flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">{a.title}</div>
                  <div className="text-sm text-gray-500">{a.meta}</div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm ${a.status === "Rejected" ? "bg-red-100 text-red-600" : a.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
