
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    technicians: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/admin");

      setStats({
        totalUsers: response.data.stats?.totalUsers || 0,
        totalTickets: response.data.stats?.totalTickets || 0,
        openTickets: response.data.stats?.openTickets || 0,
        resolvedTickets:
          response.data.stats?.resolvedTickets || 0,
        technicians:
          response.data.stats?.technicians || 0,
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
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

  const cards = [
    {
      icon: "👥",
      title: "Total Users",
      value: stats.totalUsers,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      icon: "🎫",
      title: "Total Tickets",
      value: stats.totalTickets,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      icon: "📂",
      title: "Open Tickets",
      value: stats.openTickets,
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      icon: "✓",
      title: "Resolved Tickets",
      value: stats.resolvedTickets,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      icon: "🧑‍💻",
      title: "Technicians",
      value: stats.technicians,
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white shadow-md">
              SD
            </div>

            <div>
              <h1 className="text-base font-bold text-[#172554]">
                ServiceDesk Pro
              </h1>

              <p className="text-xs text-slate-400">
                IT Service Management
              </p>
            </div>

          </div>
        </div>

        <div className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Administration
          </p>

          <button
            onClick={() => navigate("/admin")}
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>👥</span>
            User Management
          </button>

          <button
            onClick={() => navigate("/admin/tickets")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>🎫</span>
            Ticket Management
          </button>

          <button
            onClick={() => navigate("/assets")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>💻</span>
            Asset Management
          </button>

          <button
            onClick={() => navigate("/technician-management")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#172554]"
          >
            <span>🧑‍💻</span>
            Technicians
          </button>

          <div className="mt-10 px-3">

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              System Online
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Manage users, tickets, technicians and organizational assets.
            </p>

          </div>

        </div>

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.name || "System Admin"}
              </p>

              <p className="text-xs text-slate-400">
                System Admin
              </p>
            </div>

          </div>

          <button
            onClick={logout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="lg:ml-64">

        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white">

          <div className="flex items-center justify-between px-5 py-5 sm:px-8">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ef5b73]">
                Administration Portal
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#172554] sm:text-3xl">
                System Overview
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Monitor and manage the entire ServiceDesk environment.
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">
                  {user.name || "System Admin"}
                </p>

                <p className="text-xs text-slate-400">
                  System Admin
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">
                {(user.name || "A").charAt(0).toUpperCase()}
              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">

          {/* WELCOME */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#243b78] to-[#ef5b73] p-6 text-white shadow-lg sm:p-8">

            <div className="relative z-10 max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                System Administration
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Everything under control.
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/80">
                Manage users, tickets, technicians and organizational
                assets from one central workspace.
              </p>

            </div>

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5"></div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* STATS */}
          {loading ? (

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#ef5b73]"></div>

              <p className="mt-4 text-sm text-slate-500">
                Loading system overview...
              </p>
            </div>

          ) : (

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

              {cards.map((card) => (

                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {card.title}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-[#172554]">
                        {card.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg} text-lg ${card.text}`}
                    >
                      {card.icon}
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* QUICK ACTIONS */}
          <div className="mt-7">

            <div>
              <h2 className="text-xl font-bold text-[#172554]">
                Administration
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Quickly access the main management areas.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

              <button
                onClick={() => navigate("/admin/users")}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#172554]/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👥
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  User Management
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Manage users and assign system roles.
                </p>

                <p className="mt-4 text-sm font-bold text-[#ef5b73]">
                  Manage users →
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/tickets")}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#172554]/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  🎫
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  Ticket Management
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  View, assign and manage ServiceDesk tickets.
                </p>

                <p className="mt-4 text-sm font-bold text-[#ef5b73]">
                  Manage tickets →
                </p>
              </button>

              <button
                onClick={() => navigate("/assets")}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#172554]/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  💻
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  Asset Management
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  Manage organizational hardware and assets.
                </p>

                <p className="mt-4 text-sm font-bold text-[#ef5b73]">
                  Manage assets →
                </p>
              </button>

              <button
                onClick={() => navigate("/technician-management")}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#172554]/20 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-xl">
                  🧑‍💻
                </div>

                <h3 className="mt-5 font-bold text-slate-800">
                  Technician Management
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  View and manage the technician workforce.
                </p>

                <p className="mt-4 text-sm font-bold text-[#ef5b73]">
                  Manage technicians →
                </p>
              </button>

            </div>

          </div>

          <div className="py-8 text-center text-xs text-slate-400">
            ServiceDesk Pro · System Administration
          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;