import { useEffect, useState } from "react";
import api from "../services/api";

const roles = [
  "System Admin",
  "IT Manager",
  "Technician",
  "Employee",
  "Asset Manager",
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/management/users");

      setUsers(
        response.data.users ||
          response.data ||
          []
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/management/users/${userId}/role`, {
        role,
      });

      setMessage("User role updated successfully.");
      loadUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update role."
      );
    }
  };

  const updateStatus = async (user) => {
    try {
      await api.patch(
        `/management/users/${user._id}/status`,
        {
          isActive: user.isActive === false,
        }
      );

      setMessage("User status updated.");
      loadUsers();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update status."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#101b3d]">
            User Management
          </h1>

          <p className="mt-1 text-slate-500">
            Manage user roles and account status.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-sm">
          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              No users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-sm text-slate-500">
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-[#101b3d]">
                        {user.name || "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {user.email || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role || "Employee"}
                          onChange={(e) =>
                            updateRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#ff6b5f]"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isActive === false
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => updateStatus(user)}
                          className="rounded-lg bg-[#101b3d] px-4 py-2 text-xs font-semibold text-white"
                        >
                          {user.isActive === false
                            ? "Activate"
                            : "Deactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}