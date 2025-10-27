// src/components/OpportunityCard.jsx
import React from "react";

const OpportunityCard = ({ title, tags = [], applicants, date }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-gray-600 mb-1">Applicants: {applicants}</p>
      <p className="text-gray-600">Date: {date}</p>
    </div>
  );
};

export default OpportunityCard;
