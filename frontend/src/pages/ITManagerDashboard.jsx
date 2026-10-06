import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ITManagerDashboard = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ticketsRes, techniciansRes] = await Promise.all([
        api.get("/tickets"),
        api.get("/users/technicians"),
      ]);

      setTickets(ticketsRes.data.tickets || []);
      setTechnicians(techniciansRes.data.technicians || []);
    } catch (error) {
      console.error("IT Manager data error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load IT Manager data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateTicket = async (ticketId, field, value) => {
    try {
      const data = {};

      if (field === "assignedTo") {
        data.assignedTo = value === "" ? null : value;
      }

      if (field === "status") {
        data.status = value;
      }

      if (field === "priority") {
        data.priority = value;
      }

      if (field === "category") {
        data.category = value;
      }

      const response = await api.patch(
        `/tickets/${ticketId}`,
        data
      );

      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket._id === ticketId
            ? response.data.ticket
            : ticket
        )
      );
    } catch (error) {
      console.error("Update ticket error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update ticket"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    if (status === "In Progress")
      return "bg-amber-50 text-amber-700 border-amber-200";

    if (status === "Closed")
      return "bg-slate-100 text-slate-600 border-slate-200";

    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const progressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ef5b73]" />
          <p className="mt-4 text-sm text-slate-500">
            Loading IT Manager Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] font-bold text-white shadow-md">
              SD
            </div>

            <div>
              <h1 className="font-bold text-[#172554]">
                ServiceDesk Pro
              </h1>
              <p className="text-xs text-slate-400">
                IT Service Management
              </p>
            </div>

          </div>
        </div>

        <div className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            IT Management
          </p>

          <button
            onClick={() => navigate("/manager")}
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/ticket-management")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>🎫</span>
            Ticket Management
          </button>

          <button
            onClick={() => navigate("/technician-management")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>🧑‍💻</span>
            Technicians
          </button>

          <div className="mt-10 px-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Operations
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Assign technicians, prioritize tickets and monitor service operations.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] font-bold text-white">
              {(user.name || "M").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.name || "IT Manager"}
              </p>
              <p className="text-xs text-slate-400">
                IT Manager
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            ↪ Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main className="lg:ml-64">

        <header className="border-b border-slate-200 bg-white">

          <div className="flex items-center justify-between px-5 py-5 sm:px-8">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ef5b73]">
                IT Management
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#172554] sm:text-3xl">
                IT Manager Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage service tickets and technician assignments.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#ef5b73] hover:text-[#ef5b73]"
            >
              ↻ Refresh
            </button>

          </div>

        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">

          {/* HERO */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#243b78] to-[#ef5b73] p-6 text-white shadow-lg sm:p-8">

            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Service Operations
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Keep every ticket moving.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Assign technicians, manage priorities and monitor ticket progress from one place.
              </p>
            </div>

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5" />

          </div>

          {/* STATS */}
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[
              ["Total Tickets", tickets.length, "bg-blue-50", "text-blue-600", "🎫"],
              ["Open", openTickets, "bg-amber-50", "text-amber-600", "📂"],
              ["In Progress", progressTickets, "bg-purple-50", "text-purple-600", "⚙"],
              ["Resolved", resolvedTickets, "bg-emerald-50", "text-emerald-600", "✓"],
            ].map(([title, value, bg, color, icon]) => (

              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-slate-500">
                      {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-[#172554]">
                      {value}
                    </p>
                  </div>

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} ${color}`}>
                    {icon}
                  </div>

                </div>
              </div>

            ))}

          </div>

          {/* TICKETS */}
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <h2 className="text-xl font-bold text-[#172554]">
                All Service Tickets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assign technicians and control ticket priority and status.
              </p>

            </div>

            {tickets.length === 0 ? (

              <div className="p-12 text-center text-sm text-slate-500">
                No tickets available.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-200 text-left">

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Employee
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Subject
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Technician
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {tickets.map((ticket) => (

                      <tr
                        key={ticket._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-5 text-sm font-medium text-slate-700">
                          {ticket.createdBy?.name || "Unknown"}
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-semibold text-slate-800">
                            {ticket.title}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {ticket.category}
                        </td>

                        <td className="px-5 py-5">

                          <select
                            value={ticket.priority}
                            onChange={(e) =>
                              updateTicket(
                                ticket._id,
                                "priority",
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#ef5b73]"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>

                        </td>

                        <td className="px-5 py-5">

                          <select
                            value={ticket.assignedTo?._id || ""}
                            onChange={(e) =>
                              updateTicket(
                                ticket._id,
                                "assignedTo",
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#ef5b73]"
                          >

                            <option value="">
                              Unassigned
                            </option>

                            {technicians.map((technician) => (
                              <option
                                key={technician._id}
                                value={technician._id}
                              >
                                {technician.name}
                              </option>
                            ))}

                          </select>

                        </td>

                        <td className="px-5 py-5">

                          <select
                            value={ticket.status}
                            onChange={(e) =>
                              updateTicket(
                                ticket._id,
                                "status",
                                e.target.value
                              )
                            }
                            className={`rounded-full border px-3 py-2 text-xs font-bold outline-none ${getStatusStyle(
                              ticket.status
                            )}`}
                          >

                            <option value="Open">Open</option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                            <option value="Closed">
                              Closed
                            </option>

                          </select>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          <div className="py-8 text-center text-xs text-slate-400">
            ServiceDesk Pro · IT Management
          </div>

        </div>

      </main>

    </div>
  );
};

export default ITManagerDashboard;