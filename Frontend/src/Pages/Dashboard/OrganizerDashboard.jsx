import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [stats, setStats] = useState({
    eventsOrganized: 0,
    totalApplicants: 0,
    messages: 0,
    followers: 0,
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await api.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allEvents = Array.isArray(res.data) ? res.data : [];
      const myEvents = allEvents.filter(
        (event) => event.organizerId === storedUser.id || event.organizerId === storedUser._id
      );

      setMyEvents(myEvents);

      const totalApps = myEvents.reduce(
        (sum, ev) => sum + (ev.participantsCount || ev.applicants?.length || 0),
        0
      );

      setStats({
        eventsOrganized: myEvents.length,
        totalApplicants: totalApps,
        messages: 0,
        followers: 0,
      });
    } catch (err) {
      console.error("Error fetching my events:", err);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  // View participants for an event - FIXED
  const handleViewApplicants = async (event) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ Use event.id instead of event._id (Sequelize uses 'id')
      const res = await api.get(`/registrations/${event.id}/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setParticipants(res.data?.participants || res.data || []);
      setSelectedEvent(event);
      setShowParticipants(true);
    } catch (err) {
      console.error("Error fetching participants:", err);
      toast.error(err.response?.data?.message || "Failed to load participants");
    }
  };

  // Send message to participants - FIXED
  const handleSendMessage = async (eventId, subject, message) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // ✅ Correct API endpoint and payload
      const res = await api.post(
        `/messages/${eventId}/message`,
        { subject, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Message sent to ${res.data.sentTo || 0} participants successfully!`
      );
      setShowMessageModal(false);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(
        err.response?.data?.message || "Failed to send message"
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Toaster />
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center mb-8 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome Organizer, {user?.name || "User"} 🎉
          </h1>
          <p className="text-lg mb-4">
            You're currently in <b>Organizer</b> mode. Manage your events and
            find the perfect team!
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 font-semibold transition transform hover:scale-105"
        >
          ➕ Post New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Events Organized"
          value={stats.eventsOrganized}
          icon="🎯"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon="👥"
        />
        <StatCard title="Messages" value={stats.messages} icon="💬" />
        <StatCard title="Followers" value={stats.followers} icon="⭐" />
      </div>

      {/* My Events */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Events</h2>
        <button
          onClick={fetchMyEvents}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your events...</p>
        </div>
      ) : myEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-md">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Events Posted Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by creating your first event!
          </p>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myEvents.map((event) => (
            <div key={event.id} className="relative">
              <OpportunityCard
                title={event.title}
                tags={[event.location || "Location TBD", ...(event.tags || [])]}
                applicants={event.participantsCount || "0"}
                date={formatDate(event.date)}
                description={event.description}
                buttonLabel="View Applicants"
                onClick={() => handleViewApplicants(event)}
              />
              <button
                onClick={() => {
                  setSelectedEvent(event);
                  setShowMessageModal(true);
                }}
                className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm font-semibold"
              >
                📧 Message Participants
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Post Event Modal */}
      {showPostModal && (
        <PostEventModal
          onClose={() => setShowPostModal(false)}
          onSuccess={fetchMyEvents}
        />
      )}

      {/* View Participants Modal */}
      {showParticipants && (
        <ParticipantsModal
          event={selectedEvent}
          participants={participants}
          onClose={() => {
            setShowParticipants(false);
            setParticipants([]);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Send Message Modal */}
      {showMessageModal && selectedEvent && (
        <MessageModal
          event={selectedEvent}
          onClose={() => setShowMessageModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </>
  );
}

// Post Event Modal Component
function PostEventModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    lastDateToRegister: "",
    banner: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("date", form.date);
      formData.append("lastDateToRegister", form.lastDateToRegister);
      if (form.banner) formData.append("banner", form.banner);

      const res = await api.post("/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Event created successfully! 🎉");
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error creating event:", err);
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🎯 Post New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="e.g., Tech Fest 2025"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Describe your event..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Event venue"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              name="lastDateToRegister"
              value={form.lastDateToRegister}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Banner
            </label>
            <input
              type="file"
              name="banner"
              onChange={handleChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Participants Modal - Table Format
function ParticipantsModal({ event, participants, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-8 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              👥 Applicants for "{event.title}"
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Participants: {participants.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-lg">No applicants yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-teal-50">
                  <th className="text-left p-4 font-semibold text-gray-700 border-b-2 border-green-200">
                    #
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b-2 border-green-200">
                    Name
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b-2 border-green-200">
                    Email
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b-2 border-green-200">
                    Skills
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700 border-b-2 border-green-200">
                    Interests
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr
                    key={participant.id}
                    className="border-b border-gray-100 hover:bg-green-50 transition"
                  >
                    <td className="p-4 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                          {participant.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {participant.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {participant.email || "No email provided"}
                    </td>
                    <td className="p-4">
                      {participant.skills && participant.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {participant.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No skills listed</span>
                      )}
                    </td>
                    <td className="p-4">
                      {participant.interests && participant.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {participant.interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No interests listed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Message Modal - FIXED to use event.id
function MessageModal({ event, onClose, onSend }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error("Please fill subject and message");
      return;
    }

    setSending(true);
    try {
      // ✅ Use event.id instead of event._id
      await onSend(event.id, subject, message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📧 Message Participants
        </h2>
        <p className="text-gray-600 mb-6">
          Send a message to all participants of "{event.title}"
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="6"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Type your message here..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}