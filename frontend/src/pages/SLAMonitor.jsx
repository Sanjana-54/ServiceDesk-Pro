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

      const data =
        response.data?.tickets ||
        response.data?.data ||
        response.data ||
        [];

      setTickets(Array.isArray(data) ? data : []);
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
              MANAGEMENT
            </p>

            <nav className="mt-4 space-y-2">

              <SidebarItem
                icon="▣"
                label="Dashboard"
                onClick={() => navigate("/manager")}
              />

              <SidebarItem
                icon="▥"
                label="Ticket Management"
                onClick={() => navigate("/ticket-management")}
              />

              <SidebarItem
                icon="♙"
                label="Technicians"
                onClick={() => navigate("/technician-management")}
              />

              <SidebarItem
                active
                icon="◷"
                label="SLA Monitoring"
              />

              <SidebarItem
                icon="▤"
                label="Reports"
                onClick={() => navigate("/reports")}
              />

              <SidebarItem
                icon="?"
                label="Knowledge Base"
                onClick={() => navigate("/knowledge")}
              />

            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">

            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">

                <Avatar name={user.name} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#101b3d]">
                    {user.name || "IT Manager"}
                  </p>

                  <p className="text-xs text-slate-500">
                    IT Manager
                  </p>
                </div>

              </div>
            </div>

            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>

          </div>
        </aside>

        {/* MAIN */}
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

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#101b3d]">
                  {user.name || "IT Manager"}
                </p>

                <p className="text-xs text-slate-500">
                  IT Manager
                </p>
              </div>

              <Avatar name={user.name} />

            </div>

          </header>

          <div className="p-6 lg:p-10">

            <p className="text-sm font-semibold text-[#ff5d73]">
              SLA MANAGEMENT
            </p>

            <h2 className="mt-1 text-3xl font-bold text-[#101b3d]">
              SLA Monitor
            </h2>

            <p className="mt-2 text-sm text-slate-500 lg:text-base">
              Identify tickets that need immediate attention.
            </p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

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
                          <tr
                            key={ticket._id}
                            className="hover:bg-slate-50"
                          >

                            <td className="px-6 py-5">
                              <p className="font-semibold text-[#101b3d]">
                                {ticket.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                #{ticket._id?.slice(-6)}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              {ticket.priority || "Medium"}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
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

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
        active
          ? "bg-[#243d7d] text-white shadow-md"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active ? "bg-white/10" : "bg-slate-100"
        }`}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#182653] to-[#ff5d73] text-sm font-bold text-white">
      {(name || "M").charAt(0).toUpperCase()}
    </div>
  );
}