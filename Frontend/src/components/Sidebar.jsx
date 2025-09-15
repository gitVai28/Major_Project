import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 bg-white shadow-md h-screen p-4">
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link></li>
        <li><Link to="/profile" className="hover:text-blue-600">Profile</Link></li>
        <li><Link to="/roles" className="hover:text-blue-600">Roles Board</Link></li>
      </ul>
    </div>
  );
}
