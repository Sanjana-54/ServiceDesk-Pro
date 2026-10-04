import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const roles = [
  "System Admin",
  "IT Manager",
  "Technician",
  "Employee",
  "Asset Manager",
];

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (id, role) => {
    try {
      setError("");
      setMessage("");

      await api.patch(`/users/${id}/role`, {
        role,
      });

      setMessage("User role updated successfully");

      await loadUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update role"
      );
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/users/${id}`);

      setMessage("User deleted successfully");

      await loadUsers();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete user"
      );
    }
  };

  const getRoleClass = (role) => {
    if (role === "System Admin") {
      return "bg-red-100 text-red-700";
    }

    if (role === "IT Manager") {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "Asset Manager") {
      return "bg-orange-100 text-orange-700";
    }

    if (role === "Technician") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage ServiceDesk Pro users and roles
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            All Users
          </h2>

          <p className="text-sm text-gray-500">
            Total users: {users.length}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Created
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y">

                  {users.map((user) => (

                    <tr key={user._id}>

                      <td className="px-5 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-5">

                        <select
                          value={user.role}
                          onChange={(e) =>
                            changeRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-2 text-xs font-semibold ${getRoleClass(
                            user.role
                          )}`}
                        >

                          {roles.map((role) => (
                            <option
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>
                          ))}

                        </select>

                      </td>

                      <td className="px-5 py-5 text-sm text-gray-500">
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-5 py-5">

                        <button
                          onClick={() =>
                            deleteUser(user._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default UserManagement;