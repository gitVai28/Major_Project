import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeApplications: 0,
    eventsRegistered: 0,
    messages: 0,
    rating: "4.8",
  });

  // Fetch all available events
  useEffect(() => {
    fetchEvents();
    fetchMyApplications();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events");
      setEvents(res.data?.events || res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/registrations/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apps = res.data?.registrations || res.data || [];
      setMyApplications(apps);

      setStats((prev) => ({
        ...prev,
        activeApplications: apps.length,
        eventsRegistered: apps.length,
      }));
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // Apply for event
  const handleApply = async (event) => {
    if (!event || !event._id) {
      toast.error("Invalid event");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.post(
        "/registrations/register",
        { eventId: event._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success(`Successfully applied for "${event.title}"!`);
        fetchMyApplications();
        fetchEvents();
      }
    } catch (err) {
      console.error("Error applying for event:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to apply for event";
      toast.error(errorMsg);
    }
  };

  // Check if user has already applied
  const hasApplied = (eventId) => {
    return myApplications.some(
      (app) => app.eventId === eventId || app.event?._id === eventId
    );
  };

  // Format date
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center mb-8 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "User"} 🎉
          </h1>
          <p className="text-lg mb-4">
            You're currently in <b>Participant</b> mode. Discover amazing
            opportunities and showcase your talents!
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          icon="📅"
        />
        <StatCard
          title="Events Registered"
          value={stats.eventsRegistered}
          icon="🎯"
        />
        <StatCard title="Messages" value={stats.messages} icon="💬" />
        <StatCard title="Rating" value={stats.rating} icon="⭐" />
      </div>

      {/* Trending Opportunities Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Trending Opportunities
        </h2>
        <button
          onClick={fetchEvents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-md">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Events Available
          </h3>
          <p className="text-gray-500">
            Check back later for exciting opportunities!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => {
            const applied = hasApplied(event._id);
            const tags = [
              event.location || "Location TBD",
              ...(event.tags || []),
            ];

            return (
              <OpportunityCard
                key={event._id}
                title={event.title}
                tags={tags}
                applicants={event.participantsCount || "0"}
                date={formatDate(event.date)}
                description={event.description}
                buttonLabel={applied ? "✓ Applied" : "Apply Now"}
                onClick={() => !applied && handleApply(event)}
                disabled={applied}
                status={applied ? "applied" : "open"}
              />
            );
          })}
        </div>
      )}

      {/* My Applications Section */}
      {myApplications.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            My Applications
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="space-y-4">
              {myApplications.map((app, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 flex justify-between items-center hover:border-purple-300 transition"
                >
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {app.event?.title || app.eventTitle || "Event"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Applied on{" "}
                      {formatDate(app.registeredAt || app.createdAt)}
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm bg-green-100 text-green-600 font-semibold">
                    ✓ Registered
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}