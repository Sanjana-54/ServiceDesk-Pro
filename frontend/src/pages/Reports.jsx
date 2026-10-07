import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Reports() {
  const navigate = useNavigate();

  const [performance, setPerformance] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [performanceResponse, summaryResponse] =
        await Promise.all([
          api.get("/reports/support-performance"),
          api.get("/reports/ticket-summary"),
        ]);

      setPerformance(
        performanceResponse.data.performance ||
          performanceResponse.data.data ||
          performanceResponse.data ||
          []
      );

      setSummary(
        summaryResponse.data.summary ||
          summaryResponse.data.data ||
          summaryResponse.data ||
          {}
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const total =
    summary.total ||
    summary.totalTickets ||
    summary.count ||
    0;

  const open =
    summary.open ||
    summary.openTickets ||
    0;

  const progress =
    summary.inProgress ||
    summary.inProgressTickets ||
    0;

  const resolved =
    summary.resolved ||
    summary.resolvedTickets ||
    0;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
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
                label="SLA Monitoring"
                icon="◷"
                onClick={() => navigate("/sla-monitor")}
              />

              <NavItem
                active
                label="Reports"
                icon="▤"
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
              className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
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
                SUPPORT REPORTS
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Service desk performance overview
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
                Reports & Analytics
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#101b3d]">
                Support Performance
              </h2>

              <p className="mt-2 text-sm text-slate-500 lg:text-base">
                Understand ticket volume and technician performance.
              </p>
            </section>

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* SUMMARY */}
            <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Total Tickets"
                value={total}
                icon="▣"
                iconClass="bg-blue-50 text-blue-700"
              />

              <StatCard
                title="Open"
                value={open}
                icon="◷"
                iconClass="bg-rose-50 text-[#ff5d73]"
              />

              <StatCard
                title="In Progress"
                value={progress}
                icon="↻"
                iconClass="bg-indigo-50 text-indigo-700"
              />

              <StatCard
                title="Resolved"
                value={resolved}
                icon="✓"
                iconClass="bg-emerald-50 text-emerald-600"
              />

            </section>

            {/* REPORT TABLE */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                    TECHNICIAN PERFORMANCE
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-[#101b3d]">
                    Support Team
                  </h3>
                </div>

                <button
                  onClick={loadReports}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Refresh
                </button>

              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-500">
                  Loading reports...
                </div>
              ) : performance.length === 0 ? (
                <div className="mt-6 rounded-xl bg-slate-50 p-10 text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-slate-400 shadow-sm">
                    ▤
                  </div>

                  <p className="mt-3 font-semibold text-[#101b3d]">
                    No performance data
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Technician performance information will appear here.
                  </p>

                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">

                  <table className="w-full min-w-[750px]">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                          Technician
                        </th>

                        <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                          Assigned
                        </th>

                        <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                          Resolved
                        </th>

                        <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                          Open
                        </th>

                        <th className="px-5 py-4 text-left text-xs uppercase tracking-wide text-slate-500">
                          Performance
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y">

                      {performance.map((item, index) => {

                        const name =
                          item.technician?.name ||
                          item.technicianName ||
                          item.name ||
                          `Technician ${index + 1}`;

                        const assigned =
                          item.assigned ||
                          item.assignedTickets ||
                          0;

                        const resolved =
                          item.resolved ||
                          item.resolvedTickets ||
                          0;

                        const openTickets =
                          item.open ||
                          item.openTickets ||
                          0;

                        const percentage =
                          assigned > 0
                            ? Math.round(
                                (resolved / assigned) * 100
                              )
                            : 0;

                        return (
                          <tr key={item._id || index}>

                            <td className="px-5 py-5">
                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5d73] to-[#a74375] text-xs font-bold text-white">
                                  {name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span className="font-semibold text-[#101b3d]">
                                  {name}
                                </span>

                              </div>
                            </td>

                            <td className="px-5 py-5 text-sm text-slate-600">
                              {assigned}
                            </td>

                            <td className="px-5 py-5 text-sm text-slate-600">
                              {resolved}
                            </td>

                            <td className="px-5 py-5 text-sm text-slate-600">
                              {openTickets}
                            </td>

                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#182653] to-[#ff5d73]"
                                    style={{
                                      width: `${Math.min(
                                        percentage,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-xs font-semibold text-slate-600">
                                  {percentage}%
                                </span>

                              </div>

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

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-[#101b3d]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}