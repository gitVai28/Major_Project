import React from "react";

/**
 * Card similar to screenshot: big white card with gradient top border and big action button.
 */
export default function OpportunityCard({ title, tags = [], applicants, date, description, buttonLabel = "Apply Now" }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border-t-8 border-transparent" style={{ borderImage: "linear-gradient(90deg,#ff6cc9,#7b61ff) 1" }}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 text-white flex items-center justify-center text-2xl">🎤</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>

          <div className="flex gap-2 flex-wrap mb-4">
            {tags.map((t, i) => (
              <span key={i} className="text-sm bg-gray-100 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-gray-500 text-sm mb-4">
            <div>👥 {applicants} applicants</div>
            <div>📅 {date}</div>
          </div>

          <div className="flex items-center justify-between">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold transition hover:scale-101">
              {buttonLabel}
            </button>
            <button className="ml-4 p-3 rounded-full border">♡</button>
          </div>
        </div>
      </div>
    </div>
  );
}
