import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";

export default function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Organizer, {user?.name || "User"} 🎉</h1>
          <p className="text-lg mb-4">You're currently in <b>Organizer</b> mode.</p>
        </div>
        <button className="bg-white text-green-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100">
          ➕ Post Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <StatCard title="Events Organized" value="2" icon="🏆" />
        <StatCard title="Applications Received" value="20" icon="📑" />
        <StatCard title="Messages" value="5" icon="💬" />
        <StatCard title="Followers" value="150" icon="👥" />
      </div>

      {/* Events */}
      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      <div className="space-y-6">
        <OpportunityCard
          title="Hackathon Volunteers Needed"
          tags={["Coding", "Team Work"]}
          applicants="10"
          date="2025-10-01"
        />
      </div>
    </>
  );
}
