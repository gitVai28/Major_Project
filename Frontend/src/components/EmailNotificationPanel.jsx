import React from "react";
import { X } from "lucide-react";

export default function EmailNotificationPanel({ emails, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" onClick={onClose}></div>
      <div className="fixed right-6 bottom-6 bg-white shadow-2xl rounded-2xl w-[360px] p-5 z-[1001] animate-fadeIn border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg text-gray-800">📩 Sent Emails</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>
        {emails.length === 0 ? (
          <p className="text-gray-500 text-sm">No emails sent yet.</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {emails.map((email) => (
              <div
                key={email.id}
                className="p-3 bg-indigo-50 rounded-lg text-sm text-gray-700 border border-indigo-100"
              >
                <p>
                  <b>{email.user}</b> ({email.email})
                </p>
                <p className="text-gray-600">
                  was notified about <b>{email.eventTitle}</b>
                </p>
                <p className="text-xs text-gray-400 mt-1">{email.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
