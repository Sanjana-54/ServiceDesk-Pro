import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManagerTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ticketsResponse, techniciansResponse] =
        await Promise.all([
          api.get("/tickets"),
          api.get("/users/technicians"),
        ]);

      setTickets(
        ticketsResponse.data.tickets || []
      );

      setTechnicians(
        techniciansResponse.data.technicians || []
      );
    } catch (error) {
      console.error(
        "Manager tickets error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load ticket information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateTicket = async (
    ticketId,
    field,
    value
  ) => {
    try {
      await api.patch(
        `/tickets/${ticketId}`,
        {
          [field]: value,
        }
      );

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId
            ? {
                ...ticket,
                [field]: value,
                ...(field === "assignedTo"
                  ? {
                      assignedTo:
                        technicians.find(
                          (tech) =>
                            tech._id === value
                        ) || null,
                    }
                  : {}),
              }
            : ticket
        )
      );
    } catch (error) {
      console.error(
        "Update ticket error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update ticket."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Closed":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";

      case "High":
        return "bg-orange-100 text-orange-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage support requests and assign technicians
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/it-manager")
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </div>

      </header>


      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* SUMMARY */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {tickets.length}
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Open
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                tickets.filter(
                  (ticket) =>
                    ticket.status === "Open"
                ).length
              }
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                tickets.filter(
                  (ticket) =>
                    ticket.status === "In Progress"
                ).length
              }
            </p>
          </div>


          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Technicians
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {technicians.length}
            </p>
          </div>

        </div>


        {/* TICKETS */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Support Tickets
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Assign technicians and update ticket status
              </p>
            </div>

            <button
              onClick={fetchData}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ↻ Refresh
            </button>

          </div>


          {loading ? (

            <div className="py-16 text-center text-sm text-gray-500">
              Loading tickets...
            </div>

          ) : tickets.length === 0 ? (

            <div className="py-16 text-center">

              <div className="mb-3 text-4xl">
                🎫
              </div>

              <h3 className="font-semibold text-gray-900">
                No tickets found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                There are currently no support tickets.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {tickets.map((ticket) => (

                <div
                  key={ticket._id}
                  className="p-6"
                >

                  {/* TICKET INFO */}

                  <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">

                      <h3 className="text-lg font-bold text-gray-900">
                        {ticket.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {ticket.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          #{ticket._id?.slice(-6)}
                        </span>

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                          {ticket.category}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>

                      </div>

                    </div>


                    {/* CREATED BY */}

                    <div className="text-sm lg:text-right">

                      <p className="text-gray-400">
                        Created by
                      </p>

                      <p className="font-semibold text-gray-800">
                        {ticket.createdBy?.name ||
                          "Unknown"}
                      </p>

                      <p className="text-gray-500">
                        {ticket.createdBy?.email || ""}
                      </p>

                    </div>

                  </div>


                  {/* CONTROLS */}

                  <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-2">

                    {/* STATUS */}

                    <div>

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </label>

                      <select
                        value={
                          ticket.status || "Open"
                        }
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            "status",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="Open">
                          Open
                        </option>

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

                    </div>


                    {/* TECHNICIAN */}

                    <div>

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Assign Technician
                      </label>

                      <select
                        value={
                          ticket.assignedTo?._id ||
                          ""
                        }
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            "assignedTo",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >

                        <option value="">
                          Unassigned
                        </option>

                        {technicians.map(
                          (technician) => (
                            <option
                              key={technician._id}
                              value={technician._id}
                            >
                              {technician.name}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>


                  {/* CURRENT STATUS */}

                  <div className="mt-4 flex items-center justify-between">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>

                    <span className="text-xs text-gray-400">
                      {ticket.assignedTo?.name
                        ? `Assigned to ${ticket.assignedTo.name}`
                        : "Not assigned"}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default ManagerTickets;