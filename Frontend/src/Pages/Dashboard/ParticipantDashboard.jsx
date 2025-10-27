import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";

export default function ParticipantDashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"} 🎉</h1>
          <p className="text-lg mb-4">You're currently in <b>Participant</b> mode.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <StatCard title="Active Applications" value="3" icon="📅" />
        <StatCard title="Events Registered" value="5" icon="🏆" />
        <StatCard title="Messages" value="12" icon="💬" />
        <StatCard title="Rating" value="4.8" icon="⭐" />
      </div>

      {/* Opportunities */}
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      <div className="space-y-6">
        <OpportunityCard
          title="React Developers for Tech Fest"
          tags={["React", "Frontend"]}
          applicants="15"
          date="2025-09-25"
        />
      </div>
    </>
  );
}
