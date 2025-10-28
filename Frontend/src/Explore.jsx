import React from "react";
import Navbar from "./components/Navbar";

/**
 * Explore placeholder page (you can expand to list many cards)
 */
export default function Explore() {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Explore Opportunities</h1>
        <div className="bg-white p-6 rounded-2xl card-shadow">
          <p className="text-gray-600">Search bar and filters will be here. Replace with your event list or API results.</p>
        </div>
      </main>
    </div>
  );
}
