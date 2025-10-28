import React, { useState } from "react";
import { Check, X } from "lucide-react";

/**
 * NotificationPanel component
 * ---------------------------
 * Displays a scrollable list of notifications and allows
 * marking them as read or closing the panel.
 *
 * Props:
 *  - notifications: Array<{ id, title, time, read? }>
 *  - onClose: function
 *  - onUpdate?: function (called when notifications are marked read)
 */

export default function NotificationPanel({
  notifications = [],
  onClose,
  onUpdate,
}) {
  const [items, setItems] = useState(notifications);

  // 🟣 Mark all as read
  const handleMarkAllRead = () => {
    const updated = items.map((n) => ({ ...n, read: true }));
    setItems(updated);
    if (onUpdate) onUpdate(updated);
  };

  // 🟢 Mark one as read
  const handleMarkRead = (id) => {
    const updated = items.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setItems(updated);
    if (onUpdate) onUpdate(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="bg-white w-full sm:w-[450px] h-full sm:h-[80vh] sm:my-auto sm:rounded-l-3xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-purple-600">
            Notifications 🔔
          </h2>
          <div className="flex gap-2">
            {items.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-3 py-1.5 rounded-lg hover:scale-105 transition"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Close"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No notifications yet 🎉
            </p>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl shadow-sm border transition ${
                  n.read
                    ? "bg-gray-50 border-gray-100"
                    : "bg-purple-50 border-purple-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`text-base ${
                        n.read ? "text-gray-700" : "text-purple-700 font-semibold"
                      }`}
                    >
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 rounded-full hover:bg-white text-purple-600"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
