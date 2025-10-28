import StatCard from "../../components/StatCard";
import OpportunityCard from "../../components/OpportunityCard";
import { useAuth } from "../../context/AuthContext";

export default function ParticipantDashboard({ appliedEvents, onApply }) {
  const { user } = useAuth();

  const sampleEvents = [
    {
      title: "React Developers for Tech Fest",
      tags: ["React", "Frontend"],
      applicants: "15",
      date: "2025-09-25",
      description: "Join our tech fest as a React developer volunteer.",
    },
    {
      title: "Event Photographer Needed",
      tags: ["Photography", "Creativity"],
      applicants: "8",
      date: "2025-10-10",
      description: "Capture moments of our annual fest!",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "User"} 🎉
          </h1>
          <p className="text-lg mb-4">You're currently in <b>Participant</b> mode.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Applications" value={appliedEvents.length} icon="📅" />
        <StatCard title="Events Registered" value="5" icon="🏆" />
        <StatCard title="Messages" value="12" icon="💬" />
        <StatCard title="Rating" value="4.8" icon="⭐" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      <div className="space-y-6">
        {sampleEvents.map((ev, i) => (
          <OpportunityCard
            key={i}
            title={ev.title}
            tags={ev.tags}
            applicants={ev.applicants}
            date={ev.date}
            description={ev.description}
            buttonLabel="Apply Now"
            onClick={() => onApply(ev)}
          />
        ))}
      </div>
    </>
  );
}
