// src/components/InfoRow.jsx
import React from "react";

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex justify-between p-3 border-b last:border-b-0">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
};

export default InfoRow;
