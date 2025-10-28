import React, { useEffect, useState } from "react";
import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

export default function OrganizerDashboard({ postedEvents, onPostEvent }) {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    eventsOrganized: 0,
    applicationsReceived: 0,
    messages: 0,
    followers: 0,
  });

  // ✅ Fetch dashboard stats dynamically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // --- Replace with your real API endpoints if different ---
        const [applicationsRes, messagesRes, followersRes] = await Promise.all([
          api.get("/organizer/applications", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/organizer/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/organizer/followers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          eventsOrganized: postedEvents.length,
          applicationsReceived: applicationsRes.data.count || 0,
          messages: messagesRes.data.count || 0,
          followers: followersRes.data.count || 0,
        });
      } catch (err) {
        console.error("Error fetching organizer stats:", err);
        setStats({
          eventsOrganized: postedEvents.length,
          applicationsReceived: 0,
          messages: 0,
          followers: 0,
        });
      }
    };

    fetchStats();
  }, [postedEvents]);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome Organizer, {user?.name || "User"} 🎉
          </h1>
          <p className="text-lg mb-4">
            You're currently in <b>Organizer</b> mode.
          </p>
        </div>
        <button
          onClick={onPostEvent}
          className="bg-white text-green-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100"
        >
          ➕ Post Event
        </button>
      </div>

      {/* ✅ Dynamic Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Events Organized"
          value={stats.eventsOrganized}
          icon="🏆"
        />
        <StatCard
          title="Applications Received"
          value={stats.applicationsReceived}
          icon="📑"
        />
        <StatCard title="Messages" value={stats.messages} icon="💬" />
        <StatCard title="Followers" value={stats.followers} icon="👥" />
      </div>

      {/* Events List */}
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      <div className="space-y-6">
        {postedEvents.length > 0 ? (
          postedEvents.map((ev, i) => (
            <OpportunityCard
              key={i}
              title={ev.title}
              tags={ev.tags}
              applicants={ev.applicants}
              date={ev.date}
              description={ev.description}
              buttonLabel="View Applicants"
            />
          ))
        ) : (
          <p className="text-gray-500">No events posted yet.</p>
        )}
      </div>
    </>
  );
}
