
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/dashboard/system-admin"
      );

      setData(response.data || {});
    } catch (error) {
      console.error("Admin dashboard error:", error);
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

  const users =
    data.totalUsers ||
    data.userCount ||
    data.stats?.totalUsers ||
    0;

  const tickets =
    data.totalTickets ||
    data.ticketCount ||
    data.stats?.totalTickets ||
    0;

  const openTickets =
    data.openTickets ||
    data.stats?.openTickets ||
    0;

  const assets =
    data.totalAssets ||
    data.assetCount ||
    data.stats?.totalAssets ||
    0;

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
              ADMINISTRATION
            </p>

            <nav className="mt-4 space-y-2">
              <SidebarItem
                active
                icon="▣"
                label="Dashboard"
                onClick={() => navigate("/admin")}
              />

              <SidebarItem
                icon="♙"
                label="Users"
                onClick={() => navigate("/admin/users")}
              />

              <SidebarItem
                icon="▣"
                label="Tickets"
                onClick={() => navigate("/admin/tickets")}
              />

              <SidebarItem
                icon="⚙"
                label="Assets"
                onClick={() => navigate("/assets")}
              />

              <SidebarItem
                icon="◷"
                label="SLA Monitoring"
                onClick={() => navigate("/sla-monitor")}
              />

              <SidebarItem
                icon="▤"
                label="Reports"
                onClick={() => navigate("/reports")}
              />

              <SidebarItem
                icon="◈"
                label="Audit Logs"
                onClick={() => navigate("/audit-logs")}
              />

              <SidebarItem
                icon="?"
                label="Knowledge Base"
                onClick={() => navigate("/knowledge/manage")}
              />
            </nav>
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <Avatar name={user.name} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#101b3d]">
                    {user.name || "System Admin"}
                  </p>

                  <p className="text-xs text-slate-500">
                    System Admin
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
                SYSTEM ADMINISTRATION
              </p>

              <p className="mt-1 text-sm text-slate-500">
                ServiceDesk Pro control center
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#101b3d]">
                  {user.name || "System Admin"}
                </p>

                <p className="text-xs text-slate-500">
                  System Admin
                </p>
              </div>

              <Avatar name={user.name} />

              <button
                onClick={logout}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 lg:hidden"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="p-6 lg:p-10">
            <section>
              <p className="text-sm font-semibold text-[#ff5d73]">
                System Admin Dashboard
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#101b3d] lg:text-4xl">
                Good to see you, {user.name || "Admin"}
              </h2>

              <p className="mt-2 text-sm text-slate-500 lg:text-base">
                Manage users, tickets, assets and the overall service desk configuration.
              </p>
            </section>

            <section className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#37306b] to-[#ff5d73] p-7 text-white shadow-lg">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-pink-100">
                    SYSTEM CONTROL CENTER
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    Everything in one workspace
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                    Keep your users, support requests, assets and system activity under control.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-5">
                  <p className="text-xs font-bold uppercase text-white/70">
                    Active Tickets
                  </p>

                  <p className="mt-1 text-4xl font-bold">
                    {openTickets}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Users"
                value={users}
                icon="♙"
                iconClass="bg-blue-50 text-blue-700"
              />

              <StatCard
                title="Total Tickets"
                value={tickets}
                icon="▣"
                iconClass="bg-rose-50 text-[#ff5d73]"
              />

              <StatCard
                title="Open Tickets"
                value={openTickets}
                icon="◷"
                iconClass="bg-orange-50 text-orange-600"
              />

              <StatCard
                title="Assets"
                value={assets}
                icon="⚙"
                iconClass="bg-emerald-50 text-emerald-600"
              />
            </section>

            <section className="mt-8">
              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.16em] text-[#ff5d73]">
                  ADMIN WORKSPACE
                </p>

                <h3 className="mt-1 text-2xl font-bold text-[#101b3d]">
                  Manage ServiceDesk Pro
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <AdminCard
                  icon="♙"
                  title="User Management"
                  description="Manage accounts, roles and user status."
                  button="Manage Users"
                  onClick={() => navigate("/admin/users")}
                />

                <AdminCard
                  icon="▣"
                  title="Ticket Management"
                  description="Review and manage all service requests."
                  button="Manage Tickets"
                  onClick={() => navigate("/admin/tickets")}
                />

                <AdminCard
                  icon="⚙"
                  title="Asset Management"
                  description="Manage hardware, software and lifecycle."
                  button="Manage Assets"
                  onClick={() => navigate("/assets")}
                />

                <AdminCard
                  icon="◷"
                  title="SLA Monitoring"
                  description="Monitor deadlines and SLA performance."
                  button="View SLA"
                  onClick={() => navigate("/sla-monitor")}
                />

                <AdminCard
                  icon="▤"
                  title="Reports"
                  description="Analyze support operations and performance."
                  button="Open Reports"
                  onClick={() => navigate("/reports")}
                />

                <AdminCard
                  icon="◈"
                  title="Audit Logs"
                  description="Track important administrative actions."
                  button="View Logs"
                  onClick={() => navigate("/audit-logs")}
                />

                <AdminCard
                  icon="?"
                  title="Knowledge Base"
                  description="Create and maintain troubleshooting solutions."
                  button="Manage Knowledge"
                  onClick={() =>
                    navigate("/knowledge/manage")
                  }
                />

                <AdminCard
                  icon="↻"
                  title="Refresh Dashboard"
                  description="Load the latest system statistics."
                  button="Refresh"
                  onClick={loadDashboard}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${
        active
          ? "bg-[#243d7d] text-white shadow-md shadow-blue-100"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          active
            ? "bg-white/15"
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
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff5d73] to-[#a74375] text-sm font-bold text-white">
      {(name || "A").charAt(0).toUpperCase()}
    </div>
  );
}

function StatCard({ title, value, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

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

function AdminCard({
  icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f3] text-lg font-bold text-[#ff5d73]">
        {icon}
      </div>

      <h4 className="mt-5 text-lg font-bold text-[#101b3d]">
        {title}
      </h4>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 rounded-lg bg-[#ff5d73] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ed5268]"
      >
        {button}
      </button>
    </div>
  );
}