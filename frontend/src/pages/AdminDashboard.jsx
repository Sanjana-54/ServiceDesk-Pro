import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import {
  pageBackground,
  contentWrapper,
  card,
  pageTitle,
  bodyText,
  primaryButton,
  secondaryButton,
} from "../styles/common";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState("");

  // ================================
  // Fetch Dashboard Data
  // ================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        dashboardResponse,
        ticketsResponse,
        techniciansResponse,
      ] = await Promise.all([
        api.get("/dashboard/admin"),
        api.get("/tickets"),
        api.get("/users/technicians"),
      ]);

      // Dashboard statistics
      const dashboardData =
        dashboardResponse.data?.dashboard ||
        dashboardResponse.data ||
        {};

      setStats({
        totalTickets:
          dashboardData.totalTickets ||
          dashboardData.total ||
          0,

        openTickets:
          dashboardData.openTickets ||
          dashboardData.open ||
          0,

        inProgressTickets:
          dashboardData.inProgressTickets ||
          dashboardData.inProgress ||
          0,

        resolvedTickets:
          dashboardData.resolvedTickets ||
          dashboardData.resolved ||
          0,
      });

      // Tickets
      setTickets(
        ticketsResponse.data?.tickets ||
          ticketsResponse.data ||
          []
      );

      // Technicians
      setTechnicians(
        techniciansResponse.data?.technicians ||
          techniciansResponse.data ||
          []
      );
    } catch (error) {
      console.error("Dashboard error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================================
  // Logout
  // ================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================================
  // Assign Ticket
  // ================================

  const handleAssign = async (
    ticketId,
    technicianId
  ) => {
    if (!technicianId) {
      return;
    }

    try {
      setAssigning(ticketId);

      await api.patch(
        `/tickets/${ticketId}/assign`,
        {
          technicianId,
        }
      );

      alert("Ticket assigned successfully.");

      await fetchDashboard();
    } catch (error) {
      console.error("Assignment error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to assign ticket."
      );
    } finally {
      setAssigning("");
    }
  };

  // ================================
  // Status Classes
  // ================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Assigned":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";

      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ================================
  // Priority Classes
  // ================================

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";

      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "low":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ================================
  // Loading
  // ================================

  if (loading) {
    return (
      <div
        className={`${pageBackground} flex min-h-screen items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#4f46e5]" />

          <p className={bodyText}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // Main UI
  // ================================

  return (
    <div className={pageBackground}>
      <div className="min-h-screen">

        {/* ================================
            Top Navigation
        ================================= */}

        <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-xl">
          <div
            className={`${contentWrapper} flex h-[72px] items-center justify-between`}
          >

            {/* Brand */}

            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl
                  bg-gradient-to-br from-[#4f46e5] to-[#6366f1]
                  text-xs font-extrabold text-white
                  shadow-[0_8px_18px_rgba(79,70,229,0.25)]
                "
              >
                SD
              </div>

              <div>
                <h1 className="text-base font-bold tracking-tight text-[#111827]">
                  ServiceDesk Pro
                </h1>

                <p className="text-[11px] text-[#9ca3af]">
                  IT Service Management
                </p>
              </div>
            </div>

            {/* User */}

            <div className="flex items-center gap-4">

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#111827]">
                  {user?.name || "Admin"}
                </p>

                <p className="text-xs text-[#9ca3af]">
                  {user?.role || "System Admin"}
                </p>
              </div>

              <div
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  bg-[#eef2ff]
                  text-sm font-bold text-[#4f46e5]
                "
              >
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-lg
                  border border-[#d1d5db]
                  bg-white
                  px-3 py-2
                  text-sm font-medium
                  text-[#374151]
                  transition-colors
                  hover:bg-[#f9fafb]
                "
              >
                Logout
              </button>

            </div>

          </div>
        </header>


        {/* ================================
            Main Content
        ================================= */}

        <main
          className={`${contentWrapper} px-4 py-8 sm:px-6 lg:px-8`}
        >

          {/* Heading */}

          <div className="mb-8">
            <h2 className={pageTitle}>
              Admin Dashboard
            </h2>

            <p className={`mt-2 ${bodyText}`}>
              Manage support tickets, technicians,
              and service requests.
            </p>
          </div>


          {/* ================================
              Statistics
          ================================= */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

            <div
              className={`${card} p-5`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    Total Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {stats.totalTickets}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl
                    bg-[#eef2ff]
                    text-lg text-[#4f46e5]
                  "
                >
                  ▦
                </div>

              </div>
            </div>


            {/* Open */}

            <div
              className={`${card} p-5`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    Open Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {stats.openTickets}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-lg text-blue-600
                  "
                >
                  ◷
                </div>

              </div>
            </div>


            {/* In Progress */}

            <div
              className={`${card} p-5`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {stats.inProgressTickets}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl
                    bg-amber-50
                    text-lg text-amber-600
                  "
                >
                  ↻
                </div>

              </div>
            </div>


            {/* Resolved */}

            <div
              className={`${card} p-5`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-[#6b7280]">
                    Resolved
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {stats.resolvedTickets}
                  </p>
                </div>

                <div
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-xl
                    bg-green-50
                    text-lg text-green-600
                  "
                >
                  ✓
                </div>

              </div>
            </div>

          </section>


          {/* ================================
              Tickets
          ================================= */}

          <section className={`${card} overflow-hidden`}>

            <div className="flex flex-col gap-3 border-b border-[#e5e7eb] p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h3 className="text-lg font-bold text-[#111827]">
                  All Support Tickets
                </h3>

                <p className={`mt-1 ${bodyText}`}>
                  View and assign support requests.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDashboard}
                className={secondaryButton}
              >
                Refresh
              </button>

            </div>


            {tickets.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f4f6] text-2xl text-[#9ca3af]">
                  ◫
                </div>

                <h3 className="text-base font-semibold text-[#111827]">
                  No tickets found
                </h3>

                <p className={`mt-1 ${bodyText}`}>
                  There are currently no support tickets.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[950px] text-left">

                  <thead className="bg-[#f9fafb]">

                    <tr className="border-b border-[#e5e7eb]">

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Ticket
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Employee
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Category
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                        Technician
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {tickets.map((ticket) => (

                      <tr
                        key={ticket._id}
                        className="border-b border-[#f0f1f3] last:border-0 hover:bg-[#fafafa]"
                      >

                        {/* Ticket */}

                        <td className="px-5 py-5 align-top">

                          <div className="max-w-[260px]">

                            <p className="font-semibold text-[#111827]">
                              {ticket.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6b7280]">
                              {ticket.description}
                            </p>

                          </div>

                        </td>


                        {/* Employee */}

                        <td className="px-5 py-5 align-top">

                          <p className="text-sm font-medium text-[#374151]">
                            {ticket.createdBy?.name ||
                              ticket.user?.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-xs text-[#9ca3af]">
                            {ticket.createdBy?.email ||
                              ticket.user?.email ||
                              ""}
                          </p>

                        </td>


                        {/* Category */}

                        <td className="px-5 py-5 align-top">

                          <span className="text-sm text-[#374151]">
                            {ticket.category ||
                              "Other"}
                          </span>

                        </td>


                        {/* Priority */}

                        <td className="px-5 py-5 align-top">

                          <span
                            className={`
                              inline-flex items-center
                              rounded-full border
                              px-2.5 py-1
                              text-xs font-semibold
                              ${getPriorityClass(
                                ticket.priority
                              )}
                            `}
                          >
                            {ticket.priority ||
                              "Medium"}
                          </span>

                        </td>


                        {/* Status */}

                        <td className="px-5 py-5 align-top">

                          <span
                            className={`
                              inline-flex items-center
                              rounded-full border
                              px-2.5 py-1
                              text-xs font-semibold
                              ${getStatusClass(
                                ticket.status
                              )}
                            `}
                          >
                            {ticket.status ||
                              "Open"}
                          </span>

                        </td>


                        {/* Assignment */}

                        <td className="px-5 py-5 align-top">

                          <div className="flex min-w-[190px] flex-col gap-2">

                            <p className="text-xs text-[#6b7280]">
                              Currently:
                              <span className="ml-1 font-semibold text-[#374151]">
                                {ticket.assignedTo?.name ||
                                  "Not assigned"}
                              </span>
                            </p>

                            <select
                              value={
                                ticket.assignedTo?._id ||
                                ""
                              }
                              disabled={
                                assigning ===
                                ticket._id
                              }
                              onChange={(e) =>
                                handleAssign(
                                  ticket._id,
                                  e.target.value
                                )
                              }
                              className="
                                h-10 rounded-lg
                                border border-[#d1d5db]
                                bg-white px-3
                                text-xs text-[#374151]
                                outline-none
                                transition
                                focus:border-[#4f46e5]
                                focus:ring-4
                                focus:ring-[#4f46e5]/10
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                              "
                            >

                              <option value="">
                                Assign technician
                              </option>

                              {technicians.map(
                                (technician) => (
                                  <option
                                    key={
                                      technician._id
                                    }
                                    value={
                                      technician._id
                                    }
                                  >
                                    {technician.name}
                                  </option>
                                )
                              )}

                            </select>

                            {assigning ===
                              ticket._id && (
                              <span className="text-[11px] text-[#6b7280]">
                                Assigning...
                              </span>
                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </main>

      </div>
    </div>
  );
}

export default AdminDashboard;