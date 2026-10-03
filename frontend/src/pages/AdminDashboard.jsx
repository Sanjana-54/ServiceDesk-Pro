import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    technicians: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingUser, setUpdatingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/admin");

      setStats(
        response.data.stats || {
          totalUsers: 0,
          totalTickets: 0,
          openTickets: 0,
          resolvedTickets: 0,
          technicians: 0,
        }
      );
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (err) {
      console.error("Users error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAllData = async () => {
    await Promise.all([
      loadDashboard(),
      loadUsers(),
    ]);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUser(userId);

      const response = await api.patch(
        `/users/${userId}/role`,
        {
          role: newRole,
        }
      );

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === userId
            ? {
                ...item,
                role: response.data.user.role,
              }
            : item
        )
      );

      await loadDashboard();
    } catch (err) {
      console.error("Role update error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to update user role."
      );
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUser(userId);

      await api.delete(`/users/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (item) => item._id !== userId
        )
      );

      await loadDashboard();
    } catch (err) {
      console.error("Delete user error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete user."
      );
    } finally {
      setDeletingUser(null);
    }
  };

  const filteredUsers = users.filter((item) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      item.name?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.role?.toLowerCase().includes(searchText)
    );
  });

  const getInitial = (name) => {
    return name
      ? name.charAt(0).toUpperCase()
      : "U";
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "System Admin":
        return "bg-purple-100 text-purple-700";

      case "IT Manager":
        return "bg-blue-100 text-blue-700";

      case "Asset Manager":
        return "bg-orange-100 text-orange-700";

      case "Technician":
        return "bg-green-100 text-green-700";

      case "Employee":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#172033]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[245px] flex-col bg-[#111827] text-white lg:flex">

        {/* BRAND */}

        <div className="flex items-center gap-3 border-b border-[#273244] px-5 py-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4f46e5] font-bold">
            SD
          </div>

          <div>
            <h2 className="text-[17px] font-semibold">
              ServiceDesk
            </h2>

            <span className="text-xs text-gray-400">
              Pro
            </span>
          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex flex-col gap-2 px-3.5 py-6">

          <button
            className="rounded-lg bg-[#1f2937] px-4 py-3 text-left text-sm font-medium text-white"
          >
            <span className="mr-3">
              ▦
            </span>
            Dashboard
          </button>

          <button
            onClick={loadAllData}
            className="rounded-lg px-4 py-3 text-left text-sm text-gray-300 transition hover:bg-[#1f2937] hover:text-white"
          >
            <span className="mr-3">
              ↻
            </span>
            Refresh
          </button>

        </nav>

        {/* USER */}

        <div className="mt-auto border-t border-[#273244] p-4">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f46e5] font-semibold">
              {getInitial(user?.name)}
            </div>

            <div className="min-w-0">
              <strong className="block truncate text-sm">
                {user?.name || "Admin"}
              </strong>

              <span className="text-xs text-gray-400">
                {user?.role || "System Admin"}
              </span>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="min-h-screen lg:ml-[245px]">

        {/* HEADER */}

        <header className="flex min-h-[72px] items-center justify-between border-b border-[#e5e7eb] bg-white px-5 sm:px-8">

          <div>
            <h1 className="text-lg font-bold text-[#111827]">
              System Admin Dashboard
            </h1>

            <p className="mt-1 text-xs text-[#9ca3af]">
              Manage users, roles and ServiceDesk operations
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <strong className="block text-sm text-[#111827]">
                {user?.name || "Admin"}
              </strong>

              <span className="text-xs text-[#9ca3af]">
                System Admin
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4f46e5] font-semibold text-white">
              {getInitial(user?.name)}
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="p-5 sm:p-8">

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

              <span>
                {error}
              </span>

              <button
                onClick={() => {
                  setError("");
                  loadAllData();
                }}
                className="font-semibold underline"
              >
                Retry
              </button>

            </div>
          )}


          {/* WELCOME */}

          <section className="mb-7 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] p-6 text-white shadow-lg sm:p-8">

            <p className="text-sm font-medium text-indigo-100">
              System Administration
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Welcome back, {user?.name || "Admin"} 👋
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100">
              Monitor ServiceDesk activity and manage users,
              roles and access from one place.
            </p>

          </section>


          {/* STATISTICS */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            {/* USERS */}

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                ◉
              </div>

              <span className="text-sm text-gray-500">
                Total Users
              </span>

              <strong className="mt-1 block text-2xl font-bold text-gray-900">
                {loading ? "—" : stats.totalUsers}
              </strong>

            </div>


            {/* TICKETS */}

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                🎫
              </div>

              <span className="text-sm text-gray-500">
                Total Tickets
              </span>

              <strong className="mt-1 block text-2xl font-bold text-gray-900">
                {loading ? "—" : stats.totalTickets}
              </strong>

            </div>


            {/* OPEN */}

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-lg text-yellow-600">
                ◷
              </div>

              <span className="text-sm text-gray-500">
                Open Tickets
              </span>

              <strong className="mt-1 block text-2xl font-bold text-gray-900">
                {loading ? "—" : stats.openTickets}
              </strong>

            </div>


            {/* RESOLVED */}

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                ✓
              </div>

              <span className="text-sm text-gray-500">
                Resolved Tickets
              </span>

              <strong className="mt-1 block text-2xl font-bold text-gray-900">
                {loading ? "—" : stats.resolvedTickets}
              </strong>

            </div>


            {/* TECHNICIANS */}

            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
                👤
              </div>

              <span className="text-sm text-gray-500">
                Technicians
              </span>

              <strong className="mt-1 block text-2xl font-bold text-gray-900">
                {loading ? "—" : stats.technicians}
              </strong>

            </div>

          </section>


          {/* USER MANAGEMENT */}

          <section className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">

            {/* SECTION HEADER */}

            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  User Management
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage user accounts and assign roles.
                </p>
              </div>

              <button
                onClick={loadUsers}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                ↻ Refresh Users
              </button>

            </div>


            {/* SEARCH */}

            <div className="border-b border-gray-100 p-5">

              <div className="relative max-w-md">

                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search by name, email or role..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

              </div>

            </div>


            {/* USERS */}

            {usersLoading ? (

              <div className="flex min-h-[250px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

                  <p className="mt-3 text-sm text-gray-500">
                    Loading users...
                  </p>

                </div>

              </div>

            ) : filteredUsers.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-4xl">
                  👥
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No users found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px]">

                  <thead>

                    <tr className="border-b border-gray-100 bg-gray-50/70">

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Email
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Role
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Created
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredUsers.map((item) => {

                      const isCurrentUser =
                        item._id === user?.id;

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                        >

                          {/* USER */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                                {getInitial(item.name)}
                              </div>

                              <div>
                                <strong className="block text-sm text-gray-900">
                                  {item.name}
                                </strong>

                                {isCurrentUser && (
                                  <span className="text-xs text-indigo-600">
                                    You
                                  </span>
                                )}
                              </div>

                            </div>

                          </td>


                          {/* EMAIL */}

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {item.email}
                          </td>


                          {/* ROLE */}

                          <td className="px-5 py-4">

                            {isCurrentUser ? (

                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleClass(
                                  item.role
                                )}`}
                              >
                                {item.role}
                              </span>

                            ) : (

                              <select
                                value={item.role}
                                disabled={
                                  updatingUser ===
                                  item._id
                                }
                                onChange={(e) =>
                                  handleRoleChange(
                                    item._id,
                                    e.target.value
                                  )
                                }
                                className={`rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${getRoleClass(
                                  item.role
                                )}`}
                              >

                                <option value="Employee">
                                  Employee
                                </option>

                                <option value="Technician">
                                  Technician
                                </option>

                                <option value="IT Manager">
                                  IT Manager
                                </option>

                                <option value="Asset Manager">
                                  Asset Manager
                                </option>

                                <option value="System Admin">
                                  System Admin
                                </option>

                              </select>

                            )}

                          </td>


                          {/* CREATED */}

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </td>


                          {/* DELETE */}

                          <td className="px-5 py-4 text-right">

                            {isCurrentUser ? (

                              <span className="text-xs text-gray-400">
                                Current account
                              </span>

                            ) : (

                              <button
                                disabled={
                                  deletingUser ===
                                  item._id
                                }
                                onClick={() =>
                                  handleDeleteUser(
                                    item._id,
                                    item.name
                                  )
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingUser ===
                                item._id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>

                            )}

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* MOBILE LOGOUT */}

          <div className="mt-6 lg:hidden">

            <button
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;