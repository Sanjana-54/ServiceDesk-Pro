import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  pageBackground,
  contentWrapper,
  card,
  pageTitle,
  bodyText,
  primaryButton,
  secondaryButton,
} from "../styles/common";

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/tickets/my-tickets"
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(
        "Failed to fetch tickets:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-50 text-green-700 border-green-200";

      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";

      case "Assigned":
        return "bg-purple-50 text-purple-700 border-purple-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";

      case "Critical":
        return "bg-red-100 text-red-800 border-red-300";

      case "Low":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
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

  return (
    <div
      className={`${pageBackground} min-h-screen px-4 py-8 sm:px-6 lg:px-8`}
    >
      <div className={contentWrapper}>

        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className={pageTitle}>
              My Tickets
            </h1>

            <p className={`mt-2 ${bodyText}`}>
              Track and manage all your support
              requests.
            </p>
          </div>

          <button
            className={`${primaryButton} w-auto px-5`}
            onClick={() =>
              navigate("/create-ticket")
            }
          >
            <span>+</span>
            Create Ticket
          </button>

        </div>

        {/* Summary */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className={`${card} p-5`}>
            <span className="text-sm text-[#6b7280]">
              Total Tickets
            </span>

            <strong className="mt-2 block text-2xl font-bold text-[#111827]">
              {tickets.length}
            </strong>
          </div>

          <div className={`${card} p-5`}>
            <span className="text-sm text-[#6b7280]">
              Open
            </span>

            <strong className="mt-2 block text-2xl font-bold text-[#111827]">
              {openCount}
            </strong>
          </div>

          <div className={`${card} p-5`}>
            <span className="text-sm text-[#6b7280]">
              In Progress
            </span>

            <strong className="mt-2 block text-2xl font-bold text-[#111827]">
              {progressCount}
            </strong>
          </div>

          <div className={`${card} p-5`}>
            <span className="text-sm text-[#6b7280]">
              Resolved
            </span>

            <strong className="mt-2 block text-2xl font-bold text-[#111827]">
              {resolvedCount}
            </strong>
          </div>

        </div>

        {/* Tickets Section */}

        <div className={`${card} p-5 sm:p-7`}>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Support Requests
              </h2>

              <p className={`mt-1 ${bodyText}`}>
                View the current status of your
                tickets.
              </p>
            </div>

            <button
              className={secondaryButton}
              onClick={fetchTickets}
              disabled={loading}
            >
              ↻ Refresh
            </button>

          </div>

          {/* Loading */}

          {loading ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center">

              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#4f46e5]"></div>

              <h3 className="font-semibold text-[#374151]">
                Loading tickets...
              </h3>

            </div>
          ) : tickets.length === 0 ? (

            /* Empty */

            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-6 text-center">

              <div className="mb-4 text-4xl">
                🎫
              </div>

              <h3 className="text-lg font-semibold text-[#111827]">
                No tickets yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-[#6b7280]">
                You haven't created any support
                requests.
              </p>

              <button
                onClick={() =>
                  navigate("/create-ticket")
                }
                className="mt-5 rounded-lg bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4338ca]"
              >
                Create Your First Ticket
              </button>

            </div>

          ) : (

            /* Ticket List */

            <div className="space-y-4">

              {tickets.map((ticket) => (

                <div
                  className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition-shadow hover:shadow-md"
                  key={ticket._id}
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* Ticket Information */}

                    <div className="flex min-w-0 gap-4">

                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef2ff] text-lg sm:flex">
                        🎫
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-base font-semibold text-[#111827]">
                            {ticket.title}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>

                        </div>

                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6b7280]">
                          {ticket.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#9ca3af]">

                          <span>
                            #
                            {ticket._id?.slice(
                              -6
                            )}
                          </span>

                          <span>
                            Category:{" "}
                            {ticket.category ||
                              "Other"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Priority */}

                    <div className="flex shrink-0 items-center gap-3 lg:flex-col lg:items-end">

                      <span className="text-xs font-medium text-[#9ca3af]">
                        Priority
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPriorityClass(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority ||
                          "Medium"}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default MyTickets;