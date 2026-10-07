import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SLAMonitor() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadSLA = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/sla/status");

      setTickets(
        response.data.tickets ||
          response.data.data ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load SLA information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSLA();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getStatus = (ticket) => {
    if (
      ticket.slaStatus === "Breached" ||
      ticket.status === "Breached"
    ) {
      return "Breached";
    }

    if (
      ticket.slaStatus === "At Risk" ||
      ticket.status === "At Risk"
    ) {
      return "At Risk";
    }

    return "Within SLA";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">

        <aside className="hidden w-[270px] flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#182653] to-[#ff5d73] font-bold text-white">
                SD
              </div>

              <div>
                <h1 className="font-bold text-[#101b3d]">
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
              MANAGEMENT
            </p>

            <nav className="mt-4 space-y-2">
              <NavItem
                label="Dashboard"
                icon="▣"
                onClick={() =>
                  navigate(
                    user.role === "System Admin"
                      ? "/admin"
                      : "/manager"
                  )
                }
              />

              <NavItem
                active
                label="SLA Monitoring"
                icon="◷"
              />

              <NavItem
                label="Reports"
                icon="▤"
                onClick={() => navigate("/reports")}
              />

              <NavItem
                label="Knowledge Base"
                icon="?"
                onClick={() => navigate("/knowledge")}
              />
            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-[#101b3d]">
                {user.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user.role || "Manager"}
              </p>
            </div>

            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#ff5d73]">
                SLA MONITORING
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Track response and resolution deadlines
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              Logout
            </button>
          </header>

          <div className="p-6 lg:p-10">
            <h2 className="text-3xl font-bold text-[#101b3d]">
              SLA Monitor
            </h2>

            <p className="mt-2 text-slate-500">
              Identify tickets that need immediate attention.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {error && (
                <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  Loading SLA information...
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-600">
                    ✓
                  </div>

                  <h3 className="mt-4 font-bold text-[#101b3d]">
                    No SLA issues
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    There are currently no tickets requiring SLA attention.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                          Ticket
                        </th>
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                          Priority
                        </th>
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                          SLA
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {tickets.map((ticket) => {
                        const sla = getStatus(ticket);

                        return (
                          <tr key={ticket._id}>
                            <td className="px-6 py-5">
                              <p className="font-semibold text-[#101b3d]">
                                {ticket.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                #{ticket._id?.slice(-6)}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm">
                              {ticket.priority || "Medium"}
                            </td>

                            <td className="px-6 py-5 text-sm">
                              {ticket.status || "Open"}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  sla === "Breached"
                                    ? "bg-red-100 text-red-700"
                                    : sla === "At Risk"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {sla}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
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