// src/pages/AdminTickets.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets/admin");

      setTickets(response.data.tickets || []);
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
    loadTickets();
  }, []);

  const updateStatus = async (id, status) => {
    try {
     await api.patch(`/tickets/${id}`, {
  status,
});

      loadTickets();
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
            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b p-6">

            <div>
              <h2 className="text-lg font-bold">
                All Tickets
              </h2>

              <p className="text-sm text-gray-500">
                Tickets raised by employees
              </p>
            </div>

            <button
              onClick={loadTickets}
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

              <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Ticket
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Employee
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 text-sm font-semibold">
                        #{String(ticket._id).slice(-6)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {ticket.createdBy?.name ||
                          ticket.user?.name ||
                          "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {ticket.createdBy?.email ||
                          ticket.user?.email ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {ticket.category || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {ticket.subject ||
                          ticket.title ||
                          ticket.description ||
                          "-"}
                      </td>

                      <td className="px-6 py-4">

                        <select
                          value={ticket.status || "Open"}
                          onChange={(e) =>
                            updateStatus(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-sm"
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