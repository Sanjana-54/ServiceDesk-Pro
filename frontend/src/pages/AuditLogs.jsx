import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AuditLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/audit");

      setLogs(
        response.data.logs ||
          response.data.data ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">

        <aside className="hidden w-[270px] flex-col border-r border-slate-200 bg-white lg:flex">

          <div className="border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#182653] to-[#ff5d73] font-bold text-white shadow-md">
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
              ADMINISTRATION
            </p>

            <nav className="mt-4 space-y-2">

              <NavItem
                label="Dashboard"
                icon="▣"
                onClick={() => navigate("/admin")}
              />

              <NavItem
                label="Users"
                icon="♙"
                onClick={() => navigate("/admin/users")}
              />

              <NavItem
                label="Tickets"
                icon="▣"
                onClick={() => navigate("/admin/tickets")}
              />

              <NavItem
                label="SLA Monitoring"
                icon="◷"
                onClick={() => navigate("/sla-monitor")}
              />

              <NavItem
                active
                label="Audit Logs"
                icon="◈"
              />

              <NavItem
                label="Knowledge Base"
                icon="?"
                onClick={() => navigate("/knowledge/manage")}
              />

            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-semibold text-[#101b3d]">
                {user.name || "System Admin"}
              </p>

              <p className="text-xs text-slate-500">
                System Admin
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
                SYSTEM SECURITY
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Administrative activity history
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>

          </header>

          <div className="p-6 lg:p-10">

            <section>
              <p className="text-sm font-semibold text-[#ff5d73]">
                Audit Trail
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#101b3d]">
                Audit Logs
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Track important actions performed across ServiceDesk Pro.
              </p>
            </section>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-200 p-6">

                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                    ACTIVITY
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-[#101b3d]">
                    Recent System Activity
                  </h3>
                </div>

                <button
                  onClick={loadLogs}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Refresh
                </button>

              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500">
                  Loading audit logs...
                </div>
              ) : logs.length === 0 ? (
                <div className="p-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-400">
                    ◈
                  </div>

                  <h3 className="mt-4 font-bold text-[#101b3d]">
                    No audit activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    System activity will appear here.
                  </p>

                </div>
              ) : (
                <div className="divide-y">

                  {logs.map((log, index) => (

                    <div
                      key={log._id || index}
                      className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                    >

                      <div className="flex items-start gap-4">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f3] font-bold text-[#ff5d73]">
                          ◈
                        </div>

                        <div>

                          <p className="font-semibold text-[#101b3d]">
                            {log.action || "System action"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {log.entityType || "System"}
                            {log.entityId
                              ? ` • ${String(log.entityId).slice(-8)}`
                              : ""}
                          </p>

                          {log.actor && (
                            <p className="mt-1 text-xs text-slate-400">
                              By:{" "}
                              {log.actor.name ||
                                log.actor.email ||
                                "User"}
                            </p>
                          )}

                        </div>

                      </div>

                      <div className="text-left md:text-right">

                        <p className="text-xs text-slate-400">
                          {log.createdAt
                            ? new Date(
                                log.createdAt
                              ).toLocaleString()
                            : "Unknown time"}
                        </p>

                        {log.ipAddress && (
                          <p className="mt-1 text-xs text-slate-400">
                            IP: {log.ipAddress}
                          </p>
                        )}

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

function NavItem({
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