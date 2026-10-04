import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function TicketManagement() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ticketsResponse,
        techniciansResponse,
      ] = await Promise.all([
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
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (
    ticketId,
    status
  ) => {
    try {
      setError("");
      setMessage("");

      await api.patch(
        `/tickets/${ticketId}/status`,
        { status }
      );

      setMessage(
        "Ticket status updated successfully"
      );

      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update ticket"
      );
    }
  };

  const assignTicket = async (
    ticketId,
    technicianId
  ) => {
    try {
      setError("");
      setMessage("");

      await api.patch(
        `/tickets/${ticketId}/assign`,
        {
          technicianId:
            technicianId || null,
        }
      );

      setMessage(
        "Ticket assignment updated"
      );

      await fetchData();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to assign ticket"
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Closed") {
      return "bg-gray-100 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket Management
            </h1>

            <p className="text-sm text-gray-500">
              Monitor and assign support tickets
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/it-manager")
            }
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

          <h2 className="text-xl font-bold">
            Support Tickets
          </h2>

          <p className="text-sm text-gray-500">
            Total tickets: {tickets.length}
          </p>

        </div>


        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          {loading ? (

            <div className="p-10 text-center text-gray-500">
              Loading tickets...
            </div>

          ) : tickets.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No tickets found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Ticket
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Created By
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Priority
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                      Technician
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y">

                  {tickets.map((ticket) => (

                    <tr key={ticket._id}>

                      <td className="px-5 py-5">

                        <p className="font-semibold text-gray-900">
                          {ticket.title}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          #{ticket._id?.slice(-6)}
                        </p>

                      </td>


                      <td className="px-5 py-5 text-sm text-gray-600">

                        {ticket.createdBy?.name ||
                          "Unknown"}

                      </td>


                      <td className="px-5 py-5">

                        <span className="text-sm font-semibold">
                          {ticket.priority}
                        </span>

                      </td>


                      <td className="px-5 py-5">

                        <select
                          value={
                            ticket.status || "Open"
                          }
                          onChange={(e) =>
                            updateStatus(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            ticket.status
                          )}`}
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

                      </td>


                      <td className="px-5 py-5">

                        <select
                          value={
                            ticket.assignedTo?._id ||
                            ticket.assignedTechnician?._id ||
                            ""
                          }
                          onChange={(e) =>
                            assignTicket(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
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

export default TicketManagement;