import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import {
  pageBackground,
  contentWrapper,
  card,
  heading,
  bodyText,
  primaryButton,
  secondaryButton,
} from "../styles/common";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load assigned tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await api.patch(
        `/tickets/${ticketId}/status`,
        { status }
      );

      fetchTickets();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to update ticket status."
      );
    }
  };

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

  const highPriorityCount = tickets.filter(
    (ticket) =>
      ticket.priority?.toLowerCase() === "high"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700";

      case "Assigned":
        return "bg-purple-50 text-purple-700";

      case "In Progress":
        return "bg-amber-50 text-amber-700";

      case "Resolved":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600";

      case "medium":
        return "text-amber-600";

      case "low":
        return "text-green-600";

      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`${pageBackground} min-h-screen`}
    >

      {/* Header */}

      <header className="border-b border-gray-200 bg-white">
        <div
          className={`${contentWrapper} flex min-h-[72px] items-center justify-between px-4 sm:px-6`}
        >

          {/* Brand */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
              SD
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                ServiceDesk Pro
              </h1>

              <p className="text-xs text-gray-500">
                Technician Workspace
              </p>
            </div>
          </div>

          {/* User */}

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || "Technician"}
              </p>

              <p className="text-xs text-gray-500">
                Technician
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "T"}
            </div>

            <button
              onClick={handleLogout}
              className={secondaryButton}
            >
              Logout
            </button>

          </div>

        </div>
      </header>


      {/* Main */}

      <main
        className={`${contentWrapper} px-4 py-8 sm:px-6`}
      >

        {/* Page Heading */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-medium text-indigo-600">
              Technician Dashboard
            </p>

            <h2 className={heading}>
              Welcome back, {user?.name || "Technician"} 👋
            </h2>

            <p className={`mt-2 ${bodyText}`}>
              Manage your assigned support tickets
              and update their progress.
            </p>
          </div>

          <button
            onClick={fetchTickets}
            className={primaryButton}
          >
            Refresh Tickets
          </button>

        </div>


        {/* Statistics */}

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-500">
                Assigned Tickets
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                ▦
              </div>

            </div>

            <p className="text-3xl font-bold text-gray-900">
              {tickets.length}
            </p>

          </div>


          {/* Open */}

          <div className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-500">
                Open
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                ◷
              </div>

            </div>

            <p className="text-3xl font-bold text-gray-900">
              {openCount}
            </p>

          </div>


          {/* Progress */}

          <div className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-500">
                In Progress
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
                ↻
              </div>

            </div>

            <p className="text-3xl font-bold text-gray-900">
              {progressCount}
            </p>

          </div>


          {/* Resolved */}

          <div className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">

              <span className="text-sm font-medium text-gray-500">
                Resolved
              </span>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                ✓
              </div>

            </div>

            <p className="text-3xl font-bold text-gray-900">
              {resolvedCount}
            </p>

          </div>

        </section>


        {/* Priority Alert */}

        {highPriorityCount > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

            <div>
              <p className="text-sm font-semibold text-red-800">
                High-priority tickets
              </p>

              <p className="text-xs text-red-600">
                You currently have {highPriorityCount} high-priority ticket
                {highPriorityCount !== 1 ? "s" : ""} assigned to you.
              </p>
            </div>

            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
              {highPriorityCount}
            </span>

          </div>
        )}


        {/* Tickets */}

        <section className={`${card} overflow-hidden`}>

          {/* Section Header */}

          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Assigned Tickets
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View and manage tickets assigned to you.
              </p>
            </div>

            <button
              onClick={fetchTickets}
              className={secondaryButton}
            >
              Refresh
            </button>

          </div>


          {/* Loading */}

          {loading ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center px-6">

              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

              <p className="text-sm text-gray-500">
                Loading assigned tickets...
              </p>

            </div>
          ) : tickets.length === 0 ? (

            /* Empty */

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl text-gray-500">
                ◫
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No assigned tickets
              </h3>

              <p className="mt-1 max-w-md text-sm text-gray-500">
                You don't have any support tickets assigned
                to you right now.
              </p>

            </div>
          ) : (

            /* Ticket List */

            <div className="divide-y divide-gray-100">

              {tickets.map((ticket) => (

                <div
                  key={ticket._id}
                  className="p-5 transition-colors hover:bg-gray-50"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* Ticket Information */}

                    <div className="min-w-0 flex-1">

                      <div className="mb-2 flex flex-wrap items-center gap-2">

                        <h4 className="text-base font-semibold text-gray-900">
                          {ticket.title}
                        </h4>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>

                      </div>

                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {ticket.description}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">

                        <span>
                          <strong className="font-semibold text-gray-700">
                            Category:
                          </strong>{" "}
                          {ticket.category || "Other"}
                        </span>

                        <span>
                          <strong className="font-semibold text-gray-700">
                            Priority:
                          </strong>{" "}
                          <span
                            className={`font-semibold ${getPriorityClass(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority || "Medium"}
                          </span>
                        </span>

                        <span>
                          <strong className="font-semibold text-gray-700">
                            Employee:
                          </strong>{" "}
                          {ticket.createdBy?.name ||
                            ticket.user?.name ||
                            "Unknown"}
                        </span>

                      </div>

                    </div>


                    {/* Status */}

                    <div className="w-full lg:w-48">

                      <label className="mb-2 block text-xs font-semibold text-gray-600">
                        Update Status
                      </label>

                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(
                            ticket._id,
                            e.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      >

                        <option value="Open">
                          Open
                        </option>

                        <option value="Assigned">
                          Assigned
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default TechnicianDashboard;