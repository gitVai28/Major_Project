// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-lg transition duration-200">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  );
};

export default StatCard;
