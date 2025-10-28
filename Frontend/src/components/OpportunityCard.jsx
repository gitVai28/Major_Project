import React from "react";

/**
 * Enhanced OpportunityCard matching the screenshot design
 */
export default function OpportunityCard({
  title,
  tags = [],
  applicants,
  date,
  description,
  buttonLabel = "Apply Now",
  onClick,
  disabled = false,
  status = "open",
}) {
  const getStatusColor = () => {
    if (status === "applied") return "from-green-400 to-emerald-500";
    if (status === "closed") return "from-gray-400 to-gray-500";
    return "from-pink-500 to-purple-600";
  };

  const getIcon = () => {
    const icons = ["🎤", "🎨", "💻", "🎬", "🎵", "📸", "🎯", "⚡"];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-transparent hover:border-purple-500">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 text-white flex items-center justify-center text-3xl flex-shrink-0 shadow-md">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-2xl font-bold mb-2 text-gray-800 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-4">
            {tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-purple-50 text-purple-700 rounded-full px-3 py-1 font-medium"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-sm text-gray-500">+{tags.length - 4} more</span>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-gray-500 text-sm mb-5">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span className="font-medium">{applicants} applicants</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="font-medium">{date}</span>
            </div>
            {status === "applied" && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                ✓ Applied
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClick}
              disabled={disabled}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                disabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${getStatusColor()} text-white hover:scale-[1.02] hover:shadow-lg`
              }`}
            >
              {buttonLabel}
            </button>
            <button
              className="p-3 rounded-full border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all"
              title="Save for later"
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}