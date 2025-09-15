// src/Pages/RolesBoard.jsx
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function RolesBoard() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    api.get("/home/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Event Roles Board</h2>
      {roles.length === 0 ? (
        <p className="text-gray-500">No roles posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role._id} className="p-4 bg-white shadow rounded-xl">
              <h3 className="text-lg font-semibold">{role.title}</h3>
              <p className="text-gray-600">{role.description}</p>
              <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
