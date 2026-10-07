import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function TechnicianTickets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedTicket = searchParams.get("ticket");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/technician/tickets");

      setTickets(response.data.tickets || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load assigned tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const updateStatus = async (ticketId, status) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, {
        status,
      });

      await loadTickets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update ticket status."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[270px] flex-col border-r border-slate-200 bg-white lg:flex">

          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#182653] to-[#ff5d73] text-lg font-bold text-white shadow-md">
                SD
              </div>

              <div>
                <h1 className="text-lg font-bold text-[#101b3d]">
                  ServiceDesk Pro
                </h1>

                <p className="text-xs text-slate-500">
                  IT Service Management
                </p>
              </div>

            </div>
          </div>

          <div className="flex-1 px-4 py-7">

            <p className="px-3 text-xs font-bold tracking-[0.18em] text-slate-400">
              WORKSPACE
            </p>

            <nav className="mt-4 space-y-2">

              <SideItem
                label="Dashboard"
                icon="▣"
                onClick={() => navigate("/technician")}
              />

              <SideItem
                label="My Tickets"
                icon="▥"
                active
              />

              <SideItem
                label="Work Logs"
                icon="✓"
                onClick={() => navigate("/technician/work-logs")}
              />

              <SideItem
                label="Knowledge Base"
                icon="?"
                onClick={() => navigate("/knowledge")}
              />

            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-[#101b3d]">
                {user.name || "Technician"}
              </p>

              <p className="text-xs text-slate-500">
                Technician
              </p>
            </div>

            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>

          </div>
        </aside>

        <main className="min-w-0 flex-1">

          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:px-10">

            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#ff5d73]">
                TECHNICIAN PORTAL
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your assigned support requests
              </p>
            </div>

            <button
              onClick={() => navigate("/technician")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              ← Dashboard
            </button>

          </header>

          <div className="p-6 lg:p-10">

            <section>

              <p className="text-sm font-semibold text-[#ff5d73]">
                WORK QUEUE
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#101b3d]">
                My Tickets
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                View and manage tickets assigned to you.
              </p>

            </section>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                    ASSIGNED REQUESTS
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#101b3d]">
                    {tickets.length} Ticket
                    {tickets.length !== 1 ? "s" : ""}
                  </h3>
                </div>

                <button
                  onClick={loadTickets}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Refresh
                </button>

              </div>

              {loading ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <div className="mt-6 rounded-xl bg-slate-50 p-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-slate-400 shadow-sm">
                    ✓
                  </div>

                  <h3 className="mt-4 font-bold text-[#101b3d]">
                    No tickets assigned
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your assigned ticket queue is currently empty.
                  </p>

                </div>
              ) : (
                <div className="mt-6 space-y-4">

                  {tickets.map((ticket) => (

                    <div
                      key={ticket._id}
                      className={`rounded-xl border p-5 transition ${
                        selectedTicket === ticket._id
                          ? "border-[#ff5d73] bg-rose-50/30"
                          : "border-slate-200 hover:border-[#ff9aaa]"
                      }`}
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-xs font-bold text-[#ff5d73]">
                              #{ticket._id.slice(-6)}
                            </span>

                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                              {ticket.status}
                            </span>

                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                              {ticket.priority || "Medium"}
                            </span>

                          </div>

                          <h3 className="mt-3 text-lg font-bold text-[#101b3d]">
                            {ticket.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {ticket.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">

                            <span>
                              <strong className="text-slate-700">
                                Category:
                              </strong>{" "}
                              {ticket.category || "Other"}
                            </span>

                            <span>
                              <strong className="text-slate-700">
                                Employee:
                              </strong>{" "}
                              {ticket.createdBy?.name || "Unknown"}
                            </span>

                          </div>

                        </div>

                        <div className="w-full lg:w-48">

                          <label className="mb-2 block text-xs font-semibold text-slate-600">
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
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#ff5d73]"
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

                          <button
                            onClick={() =>
                              navigate(
                                `/technician/work-logs?ticket=${ticket._id}`
                              )
                            }
                            className="mt-3 w-full rounded-lg bg-[#101b3d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#182653]"
                          >
                            Add Work Log
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

function SideItem({
  label,
  icon,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
        active
          ? "bg-[#243d7d] text-white shadow-md"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
        {icon}
      </span>

      {label}
    </button>
  );
}