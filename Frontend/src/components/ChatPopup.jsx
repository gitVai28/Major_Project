import React, { useState } from "react";

/**
 * Chat popup floating box. threads: [{id, title, messages: [{from, text, time}]}]
 */
export default function ChatPopup({ threads = [], onClose = () => {} }) {
  const [current] = useState(threads[0] || null);
  const [text, setText] = useState("");

  if (!current) return null;

  return (
    <div className="fixed right-6 bottom-20 z-50 w-96">
      <div className="bg-white rounded-2xl flex flex-col h-96 card-shadow overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white flex justify-between items-center">
          <div className="font-semibold">{current.title}</div>
          <button onClick={onClose} className="opacity-90">✕</button>
        </div>

        <div className="p-4 flex-1 overflow-auto space-y-3 bg-gray-50">
          {current.messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] p-3 rounded-lg ${m.from === "me" ? "ml-auto bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs opacity-60 mt-1">{m.time}</div>
            </div>
          ))}
        </div>

        <div className="p-3 flex items-center gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-lg border"
          />
          <button onClick={() => { setText(""); alert("Message sent (mock)"); }} className="bg-indigo-600 text-white px-3 py-2 rounded-lg">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
