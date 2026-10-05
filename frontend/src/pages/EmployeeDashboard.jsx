import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // Fetch Tickets
  // ================================

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/my-tickets");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================================
  // Logout
  // ================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================================
  // Navigation
  // ================================

  const handleCreateTicket = () => {
    navigate("/create-ticket");
  };

  const handleMyTickets = () => {
    navigate("/my-tickets");
  };

  // ================================
  // Statistics
  // ================================

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open" ||
      ticket.status === "Assigned"
  ).length;

  const progressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved"
  ).length;

  // ================================
  // Status Colors
  // ================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Assigned":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // ================================
  // Priority Colors
  // ================================

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";

      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // ================================
  // Main UI
  // ================================

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#14213d]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[250px] border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* Brand */}

        <div className="border-b border-slate-100 px-6 py-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-extrabold text-white shadow-lg">
              SD
            </div>

            <div>
              <h1 className="text-base font-bold text-[#14213d]">
                ServiceDesk Pro
              </h1>

              <p className="text-xs text-slate-500">
                IT Service Management
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}

        <div className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">

            {/* Dashboard */}

            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#243b76] px-4 py-3 text-left text-sm font-semibold text-white shadow-md shadow-[#172554]/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                ▦
              </span>

              Dashboard
            </button>

            {/* My Tickets */}

            <button
              type="button"
              onClick={handleMyTickets}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#fff1f3] hover:text-[#d83f5b]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                ◫
              </span>

              My Tickets
            </button>

            {/* Create Ticket */}

            <button
              type="button"
              onClick={handleCreateTicket}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#fff1f3] hover:text-[#d83f5b]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                +
              </span>

              Create Ticket
            </button>

          </nav>

         {/* Sidebar Support Status */}

<div className="mt-8 px-2">
  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
    IT Support Online
  </div>

  <p className="mt-2 text-xs leading-5 text-slate-400">
    Need help? Create a ticket and our IT team will assist you.
  </p>
</div>
        </div>

        {/* Sidebar Bottom */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-[#14213d]">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                Employee
              </p>

            </div>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="min-h-screen lg:ml-[250px]">

        {/* =====================================================
            TOP BAR
        ====================================================== */}

        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">

          <div className="flex h-[72px] items-center justify-between px-5 sm:px-8 lg:px-10">

            {/* Mobile Brand */}

            <div className="flex items-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] text-xs font-extrabold text-white">
                SD
              </div>

              <div>

                <p className="text-sm font-bold text-[#14213d]">
                  ServiceDesk Pro
                </p>

                <p className="text-[10px] text-slate-500">
                  IT Service Management
                </p>

              </div>

            </div>

            {/* Desktop Header Text */}

            <div className="hidden lg:block">

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d83f5b]">
                Employee Portal
              </p>

            </div>

            {/* User */}

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-[#14213d]">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-slate-500">
                  Employee
                </p>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f3] text-sm font-bold text-[#d83f5b]">

                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}

              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#ef5b73] hover:bg-[#fff5f6] hover:text-[#d83f5b]"
              >
                Logout
              </button>

            </div>

          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}

        <main className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10">

          {/* Page Heading */}

          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-2 text-sm font-semibold text-[#d83f5b]">
                Employee Dashboard
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#14213d] sm:text-4xl">
                Dashboard
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                Manage your support requests and track their progress.
              </p>

            </div>

            <button
              type="button"
              onClick={handleCreateTicket}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#172554] to-[#d83f5b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#d83f5b]/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Create New Ticket
            </button>

          </div>

          {/* =====================================================
              WELCOME BANNER
          ====================================================== */}

          <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#172554] via-[#4d477d] to-[#ef5b73] p-7 text-white shadow-xl shadow-[#172554]/10 sm:p-9">

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">

              <p className="text-sm font-semibold text-white/70">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Hello, {user?.name || "there"} 👋
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Need help with something? Create a support ticket
                and our IT team will take care of it.
              </p>

            </div>

          </section>

          {/* =====================================================
              STATISTICS
          ====================================================== */}

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Tickets
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#14213d]">
                    {tickets.length}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-lg text-[#172554]">
                  ▦
                </div>

              </div>

            </div>

            {/* Open */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Open Tickets
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#c45b16]">
                    {openCount}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                  ◷
                </div>

              </div>

            </div>

            {/* In Progress */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-blue-700">
                    {progressCount}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ↻
                </div>

              </div>

            </div>

            {/* Resolved */}

            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Resolved
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                    {resolvedCount}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                  ✓
                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              RECENT TICKETS
          ====================================================== */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-lg font-bold text-[#14213d]">
                    My Recent Tickets
                  </h2>

                  <span className="rounded-full bg-[#fff0f3] px-2.5 py-1 text-[11px] font-bold text-[#d83f5b]">
                    {tickets.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Track the status of your support requests.
                </p>

              </div>

              <button
                type="button"
                onClick={fetchTickets}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#172554] hover:text-[#172554]"
              >
                Refresh
              </button>

            </div>

            {/* Loading */}

            {loading ? (

              <div className="flex flex-col items-center justify-center px-6 py-16">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#d83f5b]" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your tickets...
                </p>

              </div>

            ) : tickets.length === 0 ? (

              /* Empty State */

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0f3] text-2xl text-[#d83f5b]">
                  ◫
                </div>

                <h3 className="text-base font-bold text-[#14213d]">
                  No tickets yet
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  You haven't created any support tickets yet.
                </p>

                <button
                  type="button"
                  onClick={handleCreateTicket}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#172554] to-[#d83f5b] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5"
                >
                  Create Your First Ticket
                </button>

              </div>

            ) : (

              /* Tickets */

              <div className="divide-y divide-slate-100">

                {tickets.map((ticket) => (

                  <div
                    key={ticket._id}
                    className="p-5 transition hover:bg-slate-50 sm:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* Main Ticket */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                          <h3 className="text-base font-bold text-[#14213d]">
                            {ticket.title}
                          </h3>

                          <span
                            className={`w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>

                        </div>

                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                          {ticket.description}
                        </p>

                        {/* Metadata */}

                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">

                          <span>
                            <strong className="font-semibold text-slate-700">
                              Category:
                            </strong>{" "}
                            {ticket.category || "Other"}
                          </span>

                          <span className="flex items-center gap-1">

                            <strong className="font-semibold text-slate-700">
                              Priority:
                            </strong>

                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getPriorityClass(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority || "Medium"}
                            </span>

                          </span>

                        </div>

                      </div>

                      {/* Assigned Technician */}

                      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 lg:w-[220px] lg:shrink-0">

                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Assigned Technician
                        </p>

                        <div className="mt-3 flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8ecf8] text-xs font-bold text-[#172554]">
                            {ticket.assignedTo?.name
                              ? ticket.assignedTo.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "—"}
                          </div>

                          <p className="text-sm font-semibold text-slate-700">
                            {ticket.assignedTo?.name ||
                              "Not assigned"}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default EmployeeDashboard;