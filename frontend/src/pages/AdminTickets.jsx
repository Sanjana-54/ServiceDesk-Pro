import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ticketsResponse, techniciansResponse] =
        await Promise.all([
          api.get("/tickets/admin"),
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
    loadData();
  }, []);


  // ========================================
  // ASSIGN TECHNICIAN
  // ========================================

  const assignTechnician = async (
    ticketId,
    technicianId
  ) => {
    try {
      setError("");

      const response = await api.patch(
        `/tickets/${ticketId}`,
        {
          assignedTo: technicianId || null,
        }
      );

      const updatedTicket =
        response.data.ticket;

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId
            ? updatedTicket
            : ticket
        )
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to assign technician"
      );
    }
  };


  // ========================================
  // UPDATE STATUS
  // ========================================

  const updateStatus = async (
    ticketId,
    status
  ) => {
    try {
      setError("");

      const response = await api.patch(
        `/tickets/${ticketId}`,
        {
          status,
        }
      );

      const updatedTicket =
        response.data.ticket;

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket._id === ticketId
            ? updatedTicket
            : ticket
        )
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to update ticket"
      );
    }
  };


  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="border-b bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket Management
            </h1>

            <p className="text-sm text-gray-500">
              View and manage all ServiceDesk tickets
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>

        </div>

      </header>


      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}


        <div className="rounded-xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b p-6">

            <div>
              <h2 className="text-xl font-bold">
                All Tickets
              </h2>

              <p className="text-sm text-gray-500">
                Tickets raised by employees
              </p>
            </div>

            <button
              onClick={loadData}
              className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ↻ Refresh
            </button>

          </div>


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

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">

                    <th className="px-6 py-4">
                      Ticket
                    </th>

                    <th className="px-6 py-4">
                      Employee
                    </th>

                    <th className="px-6 py-4">
                      Email
                    </th>

                    <th className="px-6 py-4">
                      Category
                    </th>

                    <th className="px-6 py-4">
                      Subject
                    </th>

                    <th className="px-6 py-4">
                      Technician
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {tickets.map((ticket) => (

                    <tr
                      key={ticket._id}
                      className="border-b last:border-b-0"
                    >

                      {/* TICKET */}

                      <td className="px-6 py-4 font-semibold">
                        #{ticket._id.slice(-6)}
                      </td>


                      {/* EMPLOYEE */}

                      <td className="px-6 py-4">
                        {ticket.createdBy?.name ||
                          "Unknown"}
                      </td>


                      {/* EMAIL */}

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {ticket.createdBy?.email ||
                          "-"}
                      </td>


                      {/* CATEGORY */}

                      <td className="px-6 py-4">
                        {ticket.category}
                      </td>


                      {/* SUBJECT */}

                      <td className="px-6 py-4">
                        {ticket.title}
                      </td>


                      {/* TECHNICIAN */}

                      <td className="px-6 py-4">

                        <select
                          value={
                            ticket.assignedTo?._id ||
                            ""
                          }
                          onChange={(e) =>
                            assignTechnician(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="w-44 rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        >

                          <option value="">
                            Unassigned
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

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <select
                          value={
                            ticket.status
                          }
                          onChange={(e) =>
                            updateStatus(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500"
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

export default AdminTickets;