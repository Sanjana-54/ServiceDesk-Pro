import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function TechnicianWorkLogs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(
    searchParams.get("ticket") || ""
  );

  const [logs, setLogs] = useState([]);
  const [workDescription, setWorkDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/technician/tickets");

      const ticketList = response.data.tickets || [];

      setTickets(ticketList);

      if (!selectedTicket && ticketList.length > 0) {
        setSelectedTicket(ticketList[0]._id);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async (ticketId) => {
    if (!ticketId) {
      setLogs([]);
      return;
    }

    try {
      setLogsLoading(true);
      setError("");

      const response = await api.get(
        `/technician/tickets/${ticketId}/work-logs`
      );

      setLogs(response.data.workLogs || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load work logs."
      );
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadLogs(selectedTicket);
    }
  }, [selectedTicket]);

  const addWorkLog = async (e) => {
    e.preventDefault();

    if (!selectedTicket || !workDescription.trim()) {
      setError("Please select a ticket and enter your work.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post(
        `/technician/tickets/${selectedTicket}/work-logs`,
        {
          description: workDescription,
        }
      );

      setWorkDescription("");
      setMessage("Work log added successfully.");

      await loadLogs(selectedTicket);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to add work log."
      );
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const currentTicket = tickets.find(
    (ticket) => ticket._id === selectedTicket
  );

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
                onClick={() => navigate("/technician/tickets")}
              />

              <SideItem
                label="Work Logs"
                icon="✓"
                active
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
                Record your support work
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
                SUPPORT ACTIVITY
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#101b3d]">
                Work Logs
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Record troubleshooting steps and work performed on tickets.
              </p>

            </section>

            {message && (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">

              {/* ADD LOG */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                  NEW WORK LOG
                </p>

                <h3 className="mt-1 text-xl font-bold text-[#101b3d]">
                  Record Work
                </h3>

                <form
                  onSubmit={addWorkLog}
                  className="mt-6"
                >

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Ticket
                  </label>

                  <select
                    value={selectedTicket}
                    onChange={(e) =>
                      setSelectedTicket(e.target.value)
                    }
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff5d73]"
                  >

                    <option value="">
                      Select a ticket
                    </option>

                    {tickets.map((ticket) => (
                      <option
                        key={ticket._id}
                        value={ticket._id}
                      >
                        {ticket.title}
                      </option>
                    ))}

                  </select>

                  {currentTicket && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">

                      <p className="text-xs font-bold text-[#ff5d73]">
                        SELECTED TICKET
                      </p>

                      <p className="mt-1 font-semibold text-[#101b3d]">
                        {currentTicket.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Status: {currentTicket.status}
                      </p>

                    </div>
                  )}

                  <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
                    Work Performed
                  </label>

                  <textarea
                    value={workDescription}
                    onChange={(e) =>
                      setWorkDescription(e.target.value)
                    }
                    rows={7}
                    placeholder="Describe the troubleshooting steps, changes, testing, or solution..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ff5d73]"
                  />

                  <button
                    type="submit"
                    disabled={saving || !selectedTicket}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#172554] to-[#ff5d73] px-5 py-3 text-sm font-semibold text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Add Work Log"}
                  </button>

                </form>

              </div>

              {/* LOG HISTORY */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                      HISTORY
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-[#101b3d]">
                      Work Log History
                    </h3>

                  </div>

                  {selectedTicket && (
                    <button
                      onClick={() => loadLogs(selectedTicket)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  )}

                </div>

                {!selectedTicket ? (
                  <div className="mt-6 rounded-xl bg-slate-50 p-12 text-center text-sm text-slate-500">
                    Select a ticket to view its work logs.
                  </div>
                ) : logsLoading ? (
                  <div className="py-14 text-center text-sm text-slate-500">
                    Loading work logs...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="mt-6 rounded-xl bg-slate-50 p-12 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-slate-400 shadow-sm">
                      ✓
                    </div>

                    <p className="mt-3 font-semibold text-[#101b3d]">
                      No work logs yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add your first work log for this ticket.
                    </p>

                  </div>
                ) : (
                  <div className="mt-6 space-y-4">

                    {logs.map((log, index) => (

                      <div
                        key={log._id || index}
                        className="rounded-xl border border-slate-200 p-4"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff0f3] font-bold text-[#ff5d73]">
                            ✓
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="text-sm leading-6 text-slate-700">
                              {log.description ||
                                log.notes ||
                                log.workDescription ||
                                "Work performed"}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                              {log.createdAt
                                ? new Date(
                                    log.createdAt
                                  ).toLocaleString()
                                : "Recently added"}
                            </p>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>
                )}

              </div>

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