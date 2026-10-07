import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function TechnicianDashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/technician/dashboard");

      setTickets(
        response.data.tickets ||
          response.data.assignedTickets ||
          []
      );

      setStats(response.data.stats || {});
    } catch (error) {
      console.error("Technician dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

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

              <SidebarItem
                active
                icon="▣"
                label="Dashboard"
                onClick={() => navigate("/technician")}
              />

              <SidebarItem
                icon="▥"
                label="My Tickets"
                onClick={() => navigate("/technician/tickets")}
              />

              <SidebarItem
                icon="✓"
                label="Work Logs"
                onClick={() => navigate("/technician/work-logs")}
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
                    {user.name || "Technician"}
                  </p>

                  <p className="text-xs text-slate-500">
                    Technician
                  </p>

                </div>

              </div>

            </div>

            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Logout
            </button>

          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 lg:px-10">

            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#ff5d73]">
                TECHNICIAN PORTAL
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your support workspace
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-[#101b3d]">
                  {user.name || "Technician"}
                </p>

                <p className="text-xs text-slate-500">
                  Technician
                </p>

              </div>

              <Avatar name={user.name} />

              <button
                onClick={logout}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 lg:hidden"
              >
                Logout
              </button>

            </div>

          </header>

          <div className="p-6 lg:p-10">

            {/* HERO */}
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-sm font-semibold text-[#ff5d73]">
                  Technician Dashboard
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#101b3d] lg:text-4xl">
                  Good to see you, {user.name || "Technician"}
                </h2>

                <p className="mt-2 text-sm text-slate-500 lg:text-base">
                  Stay on top of assigned requests and keep your support work moving.
                </p>

              </div>

              <button
                onClick={() => navigate("/knowledge")}
                className="rounded-xl bg-gradient-to-r from-[#172554] to-[#ff5d73] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-100 transition hover:scale-[1.02]"
              >
                Search Knowledge Base
              </button>

            </section>

            {/* SUPPORT BANNER */}
            <section className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#37306b] to-[#ff5d73] p-7 text-white shadow-lg">

              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                <div>

                  <p className="text-xs font-bold tracking-[0.18em] text-pink-100">
                    YOUR SUPPORT WORKSPACE
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    What needs your attention?
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                    Review assigned requests, record your work and communicate with employees.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-5 backdrop-blur-sm">

                  <p className="text-xs font-bold uppercase text-white/70">
                    Active Tickets
                  </p>

                  <p className="mt-1 text-4xl font-bold">
                    {tickets.length}
                  </p>

                </div>

              </div>
            </section>

            {/* STATS */}
            <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              <StatCard
                title="Assigned Tickets"
                value={stats.assigned ?? tickets.length ?? 0}
                icon="▣"
                iconClass="bg-blue-50 text-blue-700"
              />

              <StatCard
                title="Open Tickets"
                value={stats.open ?? 0}
                icon="◷"
                iconClass="bg-rose-50 text-[#ff5d73]"
              />

              <StatCard
                title="In Progress"
                value={stats.inProgress ?? 0}
                icon="↻"
                iconClass="bg-indigo-50 text-indigo-700"
              />

              <StatCard
                title="Resolved"
                value={stats.resolved ?? 0}
                icon="✓"
                iconClass="bg-emerald-50 text-emerald-600"
              />

            </section>

            {/* CONTENT */}
            <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

              {/* TICKETS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                      WORK QUEUE
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-[#101b3d]">
                      My Tickets
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Requests currently assigned to you.
                    </p>

                  </div>

                  <button
                    onClick={() => navigate("/technician/tickets")}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    View All
                  </button>

                </div>

                {loading ? (
                  <div className="py-14 text-center text-sm text-slate-500">
                    Loading tickets...
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="mt-6 rounded-xl bg-slate-50 p-10 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-slate-400 shadow-sm">
                      ✓
                    </div>

                    <p className="mt-3 font-semibold text-[#101b3d]">
                      No assigned tickets
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your work queue is currently clear.
                    </p>

                  </div>
                ) : (
                  <div className="mt-6 space-y-3">

                    {tickets.slice(0, 6).map((ticket) => (

                      <div
                        key={ticket._id}
                        className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-[#ff9aaa] hover:bg-rose-50/30 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <span className="text-xs font-bold text-[#ff5d73]">
                              #{ticket._id.slice(-6)}
                            </span>

                            <StatusBadge status={ticket.status} />

                          </div>

                          <h4 className="mt-2 truncate font-semibold text-[#101b3d]">
                            {ticket.title}
                          </h4>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {ticket.description}
                          </p>

                        </div>

                        <div className="flex items-center gap-3">

                          <PriorityBadge priority={ticket.priority} />

                          <button
                            onClick={() =>
                              navigate(
                                `/technician/tickets?ticket=${ticket._id}`
                              )
                            }
                            className="rounded-lg bg-[#101b3d] px-4 py-2 text-xs font-semibold text-white"
                          >
                            Open
                          </button>

                        </div>

                      </div>

                    ))}

                  </div>
                )}

              </div>

              {/* QUICK ACTIONS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                  QUICK ACTIONS
                </p>

                <h3 className="mt-1 text-2xl font-bold text-[#101b3d]">
                  Support Tools
                </h3>

                <div className="mt-6 space-y-3">

                  <QuickAction
                    icon="▣"
                    title="Assigned Tickets"
                    text="Review and work on your tickets."
                    onClick={() => navigate("/technician/tickets")}
                  />

                  <QuickAction
                    icon="✓"
                    title="Work Logs"
                    text="Record troubleshooting and support work."
                    onClick={() => navigate("/technician/work-logs")}
                  />

                  <QuickAction
                    icon="?"
                    title="Knowledge Base"
                    text="Find solutions and troubleshooting guides."
                    onClick={() => navigate("/knowledge")}
                  />

                  <QuickAction
                    icon="↻"
                    title="Refresh Queue"
                    text="Get the latest ticket assignments."
                    onClick={loadDashboard}
                  />

                </div>

                <div className="mt-6 rounded-xl bg-gradient-to-br from-[#fff1f3] to-[#f2f4ff] p-5">

                  <p className="text-xs font-bold tracking-[0.15em] text-[#ff5d73]">
                    SUPPORT TIP
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Record your troubleshooting work after every major action.
                    This keeps the ticket history clear for the whole IT team.
                  </p>

                </div>

              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-[#243d7d] text-white shadow-md shadow-blue-100"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active
            ? "bg-white/15 text-white"
            : "bg-slate-100 text-slate-500"
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
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5d73] to-[#a74375] text-sm font-bold text-white shadow-sm">
      {(name || "T").charAt(0).toUpperCase()}
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

          <p className="text-sm font-medium text-slate-500">
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

function StatusBadge({ status }) {
  const classes = {
    Open: "bg-blue-50 text-blue-700",
    "In Progress": "bg-indigo-50 text-indigo-700",
    Resolved: "bg-emerald-50 text-emerald-700",
    Closed: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        classes[status] || "bg-blue-50 text-blue-700"
      }`}
    >
      {status || "Open"}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const classes = {
    Low: "bg-emerald-50 text-emerald-700",
    Medium: "bg-blue-50 text-blue-700",
    High: "bg-orange-50 text-orange-700",
    Critical: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        classes[priority] || classes.Medium
      }`}
    >
      {priority || "Medium"}
    </span>
  );
}

function QuickAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#ff9aaa] hover:bg-rose-50/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fff0f3] font-bold text-[#ff5d73]">
        {icon}
      </span>

      <span>
        <span className="block text-sm font-semibold text-[#101b3d]">
          {title}
        </span>

        <span className="mt-1 block text-xs text-slate-500">
          {text}
        </span>
      </span>
    </button>
  );
}