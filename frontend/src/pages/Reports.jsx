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

      const performanceData =
        performanceResponse.data?.performance ??
        performanceResponse.data?.data ??
        [];

      if (Array.isArray(performanceData)) {
        setPerformance(performanceData);
      } else {
        setPerformance([]);
      }

      const summaryData =
        summaryResponse.data?.summary ??
        summaryResponse.data?.data ??
        {};

      if (
        summaryData &&
        typeof summaryData === "object" &&
        !Array.isArray(summaryData)
      ) {
        setSummary(summaryData);
      } else {
        setSummary({});
      }
    } catch (err) {
      console.error("Reports error:", err);

      setPerformance([]);
      setSummary({});

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
    Number(
      summary.total ??
        summary.totalTickets ??
        summary.count ??
        0
    ) || 0;

  const open =
    Number(
      summary.open ??
        summary.openTickets ??
        0
    ) || 0;

  const progress =
    Number(
      summary.inProgress ??
        summary.inProgressTickets ??
        0
    ) || 0;

  const resolved =
    Number(
      summary.resolved ??
        summary.resolvedTickets ??
        0
    ) || 0;

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
                onClick={() =>
                  navigate("/ticket-management")
                }
              />

              <SidebarItem
                icon="♙"
                label="Technicians"
                onClick={() =>
                  navigate("/technician-management")
                }
              />

              <SidebarItem
                icon="◷"
                label="SLA Monitoring"
                onClick={() =>
                  navigate("/sla-monitor")
                }
              />

              <SidebarItem
                active
                icon="▤"
                label="Reports"
              />

              <SidebarItem
                icon="?"
                label="Knowledge Base"
                onClick={() =>
                  navigate("/knowledge")
                }
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
                SUPPORT REPORTS
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Service desk performance overview
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
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* SUMMARY CARDS */}
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

            {/* TECHNICIAN PERFORMANCE */}
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
                  disabled={loading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>

              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-500">
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
                          item?.technician?.name ||
                          item?.technicianName ||
                          item?.name ||
                          `Technician ${index + 1}`;

                        const assigned =
                          Number(
                            item?.assigned ??
                              item?.assignedTickets ??
                              0
                          ) || 0;

                        const resolvedCount =
                          Number(
                            item?.resolved ??
                              item?.resolvedTickets ??
                              0
                          ) || 0;

                        const openTickets =
                          Number(
                            item?.open ??
                              item?.openTickets ??
                              0
                          ) || 0;

                        const percentage =
                          assigned > 0
                            ? Math.min(
                                Math.round(
                                  (resolvedCount /
                                    assigned) *
                                    100
                                ),
                                100
                              )
                            : 0;

                        return (
                          <tr
                            key={
                              item?._id ||
                              item?.technician?._id ||
                              index
                            }
                            className="hover:bg-slate-50"
                          >

                            <td className="px-5 py-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5d73] to-[#a74375] text-xs font-bold text-white">
                                  {String(name)
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
                              {resolvedCount}
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
                                      width: `${percentage}%`,
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

function SidebarItem({
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