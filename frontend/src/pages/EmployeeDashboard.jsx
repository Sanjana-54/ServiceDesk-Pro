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

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // Fetch Tickets
  // ================================

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/tickets/my-tickets"
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================================
  // Logout
  // ================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================================
  // Navigation
  // ================================

  const handleCreateTicket = () => {
    navigate("/create-ticket");
  };

  // ================================
  // Statistics
  // ================================

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open" ||
      ticket.status === "Assigned"
  ).length;

  const progressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved"
  ).length;

  // ================================
  // Status
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
  // Priority
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
            className={`${contentWrapper} flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8`}
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

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-[#111827]">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-[#9ca3af]">
                  Employee
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
                  : "U"}
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
            Main
        ================================= */}

        <main
          className={`${contentWrapper} px-4 py-8 sm:px-6 lg:px-8`}
        >

          {/* Heading */}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className={pageTitle}>
                Dashboard
              </h2>

              <p className={`mt-2 ${bodyText}`}>
                Manage your support requests
                and track their progress.
              </p>

            </div>

            <button
              type="button"
              onClick={handleCreateTicket}
              className={primaryButton}
            >
              <span className="text-lg leading-none">
                ＋
              </span>

              Create New Ticket
            </button>

          </div>


          {/* ================================
              Welcome Card
          ================================= */}

          <section
            className="
              mb-8 overflow-hidden rounded-2xl
              bg-gradient-to-br
              from-[#eef2ff]
              via-white
              to-[#f5f7fb]
              p-6
              shadow-[0_20px_50px_rgba(15,23,42,0.06)]
              sm:p-8
            "
          >

            <p className="text-sm font-semibold text-[#4f46e5]">
              Welcome back
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
              Hello, {user?.name || "there"} 👋
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b7280]">
              Need help with something?
              Create a support ticket and
              our team will take care of it.
            </p>

          </section>


          {/* ================================
              Statistics
          ================================= */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

            <div className={`${card} p-5`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-[#6b7280]">
                    Total Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {tickets.length}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef2ff] text-lg text-[#4f46e5]">
                  ▦
                </div>

              </div>

            </div>


            {/* Open */}

            <div className={`${card} p-5`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-[#6b7280]">
                    Open Tickets
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {openCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ◷
                </div>

              </div>

            </div>


            {/* Progress */}

            <div className={`${card} p-5`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-[#6b7280]">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {progressCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
                  ↻
                </div>

              </div>

            </div>


            {/* Resolved */}

            <div className={`${card} p-5`}>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-[#6b7280]">
                    Resolved
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#111827]">
                    {resolvedCount}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                  ✓
                </div>

              </div>

            </div>

          </section>


          {/* ================================
              Recent Tickets
          ================================= */}

          <section className={`${card} overflow-hidden`}>

            {/* Header */}

            <div className="flex flex-col gap-3 border-b border-[#e5e7eb] p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#111827]">
                  My Recent Tickets
                </h2>

                <p className={`mt-1 ${bodyText}`}>
                  Track the status of your
                  support requests.
                </p>

              </div>

              <button
                type="button"
                onClick={fetchTickets}
                className={secondaryButton}
              >
                Refresh
              </button>

            </div>


            {/* Loading */}

            {loading ? (

              <div className="flex flex-col items-center justify-center px-6 py-16">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#4f46e5]" />

                <p className={`mt-4 ${bodyText}`}>
                  Loading your tickets...
                </p>

              </div>

            ) : tickets.length === 0 ? (

              /* Empty */

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f4f6] text-2xl text-[#9ca3af]">
                  ◫
                </div>

                <h3 className="text-base font-semibold text-[#111827]">
                  No tickets yet
                </h3>

                <p className={`mt-1 ${bodyText}`}>
                  You haven't created any
                  support tickets.
                </p>

                <button
                  type="button"
                  onClick={handleCreateTicket}
                  className={`${primaryButton} mt-5 max-w-[220px]`}
                >
                  Create Your First Ticket
                </button>

              </div>

            ) : (

              /* Tickets */

              <div className="divide-y divide-[#f0f1f3]">

                {tickets.map((ticket) => (

                  <div
                    key={ticket._id}
                    className="p-5 transition-colors hover:bg-[#fafafa] sm:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* Main */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                          <h3 className="text-base font-bold text-[#111827]">
                            {ticket.title}
                          </h3>

                          <span
                            className={`
                              w-fit rounded-full border
                              px-2.5 py-1
                              text-xs font-semibold
                              ${getStatusClass(
                                ticket.status
                              )}
                            `}
                          >
                            {ticket.status}
                          </span>

                        </div>


                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#6b7280]">
                          {ticket.description}
                        </p>


                        {/* Meta */}

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6b7280]">

                          <span>
                            <strong className="font-semibold text-[#374151]">
                              Category:
                            </strong>{" "}
                            {ticket.category ||
                              "Other"}
                          </span>

                          <span>
                            <strong className="font-semibold text-[#374151]">
                              Priority:
                            </strong>{" "}

                            <span
                              className={`
                                ml-1 rounded-full
                                border px-2 py-0.5
                                text-[11px] font-semibold
                                ${getPriorityClass(
                                  ticket.priority
                                )}
                              `}
                            >
                              {ticket.priority ||
                                "Medium"}
                            </span>

                          </span>

                        </div>

                      </div>


                      {/* Technician */}

                      <div
                        className="
                          w-full rounded-xl
                          border border-[#e5e7eb]
                          bg-[#f9fafb]
                          p-4
                          lg:w-[210px]
                          lg:shrink-0
                        "
                      >

                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                          Assigned Technician
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#374151]">
                          {ticket.assignedTo?.name ||
                            "Not assigned"}
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </main>

      </div>
    </div>
  );
}

export default EmployeeDashboard;