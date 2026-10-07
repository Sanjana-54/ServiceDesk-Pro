import { useEffect, useState } from "react";
import api from "../services/api";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [ticketsResponse, techniciansResponse] =
        await Promise.all([
          api.get("/tickets"),
          api.get("/management/technicians"),
        ]);

      setTickets(
        ticketsResponse.data.tickets ||
          ticketsResponse.data ||
          []
      );

      setTechnicians(
        techniciansResponse.data.technicians ||
          techniciansResponse.data.users ||
          techniciansResponse.data ||
          []
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Unable to load ticket management data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatePriority = async (ticketId, priority) => {
    try {
      await api.patch(`/management/tickets/${ticketId}/priority`, {
        priority,
      });

      setMessage("Priority updated.");
      loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update priority."
      );
    }
  };

  const assignTicket = async (ticketId, technicianId) => {
    if (!technicianId) return;

    try {
      await api.patch(`/management/tickets/${ticketId}/assign`, {
        assignedTo: technicianId,
      });

      setMessage("Ticket assigned successfully.");
      loadData();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to assign ticket."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#101b3d]">
            Ticket Management
          </h1>

          <p className="mt-1 text-slate-500">
            Assign technicians and manage ticket priorities.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {message}
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-sm">
          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Loading tickets...
            </p>
          ) : tickets.length === 0 ? (
            <p className="p-10 text-center text-slate-500">
              No tickets found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-slate-50 text-sm text-slate-500">
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Technician</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-[#101b3d]">
                        #{ticket._id.slice(-6)}
                      </td>

                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate font-medium">
                          {ticket.title}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={ticket.priority || "Medium"}
                          onChange={(e) =>
                            updatePriority(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#ff6b5f]"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={
                            ticket.assignedTo?._id ||
                            ticket.assignedTo ||
                            ""
                          }
                          onChange={(e) =>
                            assignTicket(
                              ticket._id,
                              e.target.value
                            )
                          }
                          className="min-w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#ff6b5f]"
                        >
                          <option value="">
                            Select Technician
                          </option>

                          {technicians.map((technician) => (
                            <option
                              key={technician._id}
                              value={technician._id}
                            >
                              {technician.name ||
                                technician.email}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}