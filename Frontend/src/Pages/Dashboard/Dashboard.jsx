import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import ParticipantDashboard from "./ParticipantDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import ProfileModal from "../../components/ProfileModal";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [postedEvents, setPostedEvents] = useState([]);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!user) return null;

  // 💡 Apply for an event (participant)
  const handleApply = (event) => {
    setSelectedEvent(event);
    setShowApplyModal(true);
  };

  // 💡 Confirm apply
  const confirmApply = () => {
    setAppliedEvents((prev) => [...prev, selectedEvent]);
    alert(`Successfully applied for "${selectedEvent.title}"!`);
    setShowApplyModal(false);
  };

  // 💡 Post new event (organizer)
  const handlePostEvent = (newEvent) => {
    setPostedEvents((prev) => [...prev, newEvent]);
    alert(`Event "${newEvent.title}" posted successfully!`);
    setShowPostModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        {user.role === "organizer" ? (
          <OrganizerDashboard
            postedEvents={postedEvents}
            onPostEvent={() => setShowPostModal(true)}
          />
        ) : (
          <ParticipantDashboard
            appliedEvents={appliedEvents}
            onApply={handleApply}
          />
        )}
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px] text-center">
            <h2 className="text-lg font-semibold mb-3">
              Apply for {selectedEvent?.title}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Confirm to apply for this event as a participant.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmApply}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Event Modal */}
      {showPostModal && (
        <PostEventModal
          onClose={() => setShowPostModal(false)}
          onPost={handlePostEvent}
        />
      )}
    </div>
  );
}

// 🟩 Post Event Modal (Organizer)
function PostEventModal({ onClose, onPost }) {
  const [form, setForm] = useState({
    title: "",
    date: "",
    tags: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title || !form.date) {
      alert("Please fill all required fields.");
      return;
    }
    const newEvent = {
      title: form.title,
      date: form.date,
      description: form.description,
      tags: form.tags.split(",").map((t) => t.trim()),
      applicants: 0,
    };
    onPost(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-center">Post New Event</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Event Description"
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Post Event
          </button>
        </div>
      </div>
    </div>
  );
}
