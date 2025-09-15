import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">Smart Event Buddy</h1>
      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
        <Link to="/profile" className="hover:text-indigo-600">Profile</Link>
        <Link to="/roles" className="hover:text-indigo-600">Roles</Link>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
