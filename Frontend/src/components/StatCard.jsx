import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 card-shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-3xl font-bold mt-2">{value}</div>
      </div>
      <div className="text-4xl">{icon}</div>
    </div>
  );
}
