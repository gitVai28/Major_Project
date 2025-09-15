export default function RoleCard({ role, onApply }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-bold text-lg">{role.title}</h3>
        <p className="text-gray-600">{role.description}</p>
      </div>
      <button
        onClick={() => onApply(role._id)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Apply
      </button>
    </div>
  );
}
