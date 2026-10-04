import React, { useEffect, useState } from "react";
import api from "../api";

const TechnicianDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // FETCH ASSIGNED TICKETS
  // ================================
  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Fetch assigned tickets error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch assigned tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // UPDATE TICKET STATUS
  // ================================
  const updateStatus = async (ticketId, status) => {
    try {
      await api.patch(
        `/tickets/${ticketId}/status`,
        {
          status,
        }
      );

      // Refresh tickets after successful update
      await fetchAssignedTickets();
    } catch (error) {
      console.error("Update ticket status error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update ticket status"
      );
    }
  };

  // ================================
  // LOAD TICKETS
  // ================================
  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  // ================================
  // COUNTS
  // ================================
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "High" ||
      ticket.priority === "Critical"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================
          HEADER
      ================================= */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <p className="text-indigo-600 font-semibold">
            Technician Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Technician 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your assigned support tickets and update their progress.
          </p>

        </div>
      </div>


      {/* ================================
          MAIN
      ================================= */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ================================
            STAT CARDS
        ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500 font-medium">
              Assigned Tickets
            </p>

            <h2 className="text-4xl font-bold mt-4">
              {totalTickets}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500 font-medium">
              Open
            </p>

            <h2 className="text-4xl font-bold mt-4">
              {openTickets}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500 font-medium">
              In Progress
            </p>

            <h2 className="text-4xl font-bold mt-4">
              {inProgressTickets}
            </h2>
          </div>


          <div className="bg-white border rounded-2xl p-6">
            <p className="text-gray-500 font-medium">
              Resolved
            </p>

            <h2 className="text-4xl font-bold mt-4">
              {resolvedTickets}
            </h2>
          </div>

        </div>


        {/* ================================
            HIGH PRIORITY
        ================================= */}
        {highPriorityTickets > 0 && (
          <div className="mt-6 border border-red-200 bg-red-50 rounded-xl p-4">

            <p className="font-semibold text-red-700">
              High-priority tickets
            </p>

            <p className="text-sm text-red-600 mt-1">
              You currently have {highPriorityTickets}{" "}
              high-priority ticket
              {highPriorityTickets !== 1 ? "s" : ""} assigned to you.
            </p>

          </div>
        )}


        {/* ================================
            TICKETS
        ================================= */}
        <div className="bg-white border rounded-2xl mt-8">

          <div className="flex justify-between items-center px-6 py-5 border-b">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Assigned Tickets
              </h2>

              <p className="text-gray-500 mt-1">
                View and manage tickets assigned to you.
              </p>
            </div>

            <button
              onClick={fetchAssignedTickets}
              className="px-5 py-2 border rounded-lg hover:bg-gray-50"
            >
              Refresh
            </button>

          </div>


          {/* ================================
              LOADING
          ================================= */}
          {loading ? (
            <div className="p-12 text-center">

              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>

              <p className="mt-4 text-gray-500">
                Loading assigned tickets...
              </p>

            </div>
          ) : tickets.length === 0 ? (

            /* ================================
               NO TICKETS
            ================================= */
            <div className="p-12 text-center text-gray-500">
              No tickets assigned to you.
            </div>

          ) : (

            /* ================================
               TICKET LIST
            ================================= */
            <div>

              {tickets.map((ticket) => (

                <div
                  key={ticket._id}
                  className="px-6 py-6 border-b last:border-b-0"
                >

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                    {/* TICKET INFORMATION */}
                    <div className="flex-1">

                      <div className="flex items-center gap-3">

                        <h3 className="text-lg font-bold text-gray-900">
                          {ticket.title}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : ticket.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ticket.status}
                        </span>

                      </div>


                      <p className="text-gray-600 mt-3">
                        {ticket.description}
                      </p>


                      <div className="flex flex-wrap gap-5 mt-4 text-sm">

                        <p>
                          <span className="font-semibold">
                            Category:
                          </span>{" "}
                          {ticket.category}
                        </p>

                        <p>
                          <span className="font-semibold">
                            Priority:
                          </span>{" "}
                          <span
                            className={
                              ticket.priority === "High" ||
                              ticket.priority === "Critical"
                                ? "text-red-600 font-semibold"
                                : ""
                            }
                          >
                            {ticket.priority}
                          </span>
                        </p>

                        <p>
                          <span className="font-semibold">
                            Employee:
                          </span>{" "}
                          {ticket.createdBy?.name || "Unknown"}
                        </p>

                      </div>

                    </div>


                    {/* STATUS UPDATE */}
                    <div className="w-full lg:w-56">

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Update Status
                      </label>

                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateStatus(
                            ticket._id,
                            e.target.value
                          )
                        }
                        disabled={ticket.status === "Resolved"}
                        className="w-full px-4 py-3 border rounded-lg bg-white"
                      >

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

        </div>

      </div>
    </div>
  );
};

export default TechnicianDashboard;