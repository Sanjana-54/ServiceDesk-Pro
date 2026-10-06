import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open" ||
      ticket.status === "Assigned"
  ).length;

  const progressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const actionRequired = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "Assigned":
        return "border-indigo-200 bg-indigo-50 text-indigo-700";

      case "In Progress":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "Resolved":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "Closed":
        return "border-slate-200 bg-slate-100 text-slate-700";

      default:
        return "border-slate-200 bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#14213d]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[260px] border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* LOGO */}
        <div className="border-b border-slate-100 px-6 py-6">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-extrabold text-white shadow-md">
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

        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-7">

          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">

            {/* DASHBOARD - ACTIVE */}
            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="flex w-full items-center gap-3 rounded-xl bg-[#243b76] px-4 py-3 text-left text-sm font-semibold text-white shadow-md shadow-[#243b76]/15"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                ▦
              </span>

              Dashboard
            </button>

            {/* MY TICKETS */}
            <button
              type="button"
              onClick={() => navigate("/my-tickets")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#fff0f3] hover:text-[#d83f5b]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                ◫
              </span>

              My Tickets
            </button>

            {/* CREATE TICKET */}
            <button
              type="button"
              onClick={() => navigate("/create-ticket")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#fff0f3] hover:text-[#d83f5b]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                +
              </span>

              Create Ticket
            </button>

          </nav>

          {/* SUPPORT STATUS */}
          <div className="mt-8 px-2">

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              IT Support Online
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Your support team is available to help with IT issues.
            </p>

          </div>
        </div>

        {/* USER */}
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

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#ef5b73] hover:bg-[#fff5f6] hover:text-[#d83f5b]"
          >
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <div className="min-h-screen lg:ml-[260px]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">

          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d83f5b]">
                Employee Portal
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your support workspace
              </p>
            </div>

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

        {/* PAGE */}
        <main className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-10">

          {/* HEADING */}
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-semibold text-[#d83f5b]">
                Employee Dashboard
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#14213d] sm:text-4xl">
                Good to see you, {user?.name || "there"}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                Stay on top of your support requests and take action when your IT team needs you.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/create-ticket")}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#172554] to-[#d83f5b] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#d83f5b]/20 transition hover:-translate-y-0.5"
            >
              <span className="text-lg leading-none">
                +
              </span>

              Create New Ticket
            </button>

          </div>

          {/* WELCOME BANNER */}
          <section className="relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] to-[#ef5b73] p-7 text-white shadow-lg">

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  Your support workspace
                </p>

                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  What needs your attention?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                  Review requests from your IT team, confirm resolved issues, or reopen a ticket if the problem still exists.
                </p>
              </div>

              <div className="min-w-[145px] rounded-xl border border-white/20 bg-white/10 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/65">
                  Active Requests
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {openCount + progressCount}
                </p>
              </div>

            </div>
          </section>

          {/* STATISTICS */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Tickets
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#14213d]">
                    {tickets.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-lg text-[#243b76]">
                  ▦
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Open Tickets
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#d83f5b]">
                    {openCount}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0f3] text-lg text-[#d83f5b]">
                  ◷
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#243b76]">
                    {progressCount}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-lg text-[#243b76]">
                  ↻
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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

          {/* ACTION REQUIRED */}
          {actionRequired.length > 0 && (
            <section className="mb-8">

              <div className="mb-4 flex items-end justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#d83f5b]">
                    Needs Your Attention
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-[#14213d]">
                    Action Required
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete these actions to move your support request forward.
                  </p>
                </div>

                <span className="text-xs font-bold text-[#d83f5b]">
                  {actionRequired.length} pending
                </span>

              </div>

              <div className="grid gap-4 xl:grid-cols-2">

                {actionRequired.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="rounded-2xl border border-[#f2c8d0] bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fff0f3] text-[#d83f5b]">
                          !
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Support Request
                          </p>

                          <h3 className="mt-1 font-bold text-[#14213d]">
                            {ticket.title}
                          </h3>
                        </div>

                      </div>

                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(ticket.status)}`}>
                        {ticket.status}
                      </span>

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      Your technician marked this ticket as resolved. Please confirm whether the issue is fixed.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() => navigate("/my-tickets")}
                        className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                      >
                        ✓ Confirm Resolved
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/my-tickets")}
                        className="rounded-xl border border-[#ef5b73] bg-white px-4 py-2.5 text-sm font-bold text-[#d83f5b] transition hover:bg-[#fff0f3]"
                      >
                        ↻ Not Fixed — Reopen
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/my-tickets")}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#243b76] hover:text-[#243b76]"
                      >
                        View Ticket
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            </section>
          )}

          {/* RECENT TICKETS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

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
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#243b76] hover:text-[#243b76]"
              >
                ↻ Refresh
              </button>

            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center px-6 py-16">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#d83f5b]" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your tickets...
                </p>

              </div>
            ) : tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0f3] text-2xl text-[#d83f5b]">
                  ◫
                </div>

                <h3 className="text-base font-bold text-[#14213d]">
                  No tickets yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  You haven't created any support tickets yet.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/create-ticket")}
                  className="mt-5 rounded-xl bg-gradient-to-r from-[#172554] to-[#d83f5b] px-5 py-2.5 text-sm font-bold text-white shadow-md"
                >
                  Create Your First Ticket
                </button>

              </div>
            ) : (
              <div className="divide-y divide-slate-100">

                {tickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#fafbfe] lg:flex-row lg:items-center lg:justify-between"
                  >

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-[#14213d]">
                          {ticket.title}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${getStatusClass(ticket.status)}`}
                        >
                          {ticket.status}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {ticket.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

                        <span>
                          Category:{" "}
                          <strong className="text-slate-700">
                            {ticket.category}
                          </strong>
                        </span>

                        <span>
                          Priority:{" "}
                          <strong className="text-slate-700">
                            {ticket.priority}
                          </strong>
                        </span>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="hidden min-w-[150px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 lg:block">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Assigned Technician
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#14213d]">
                          {ticket.assignedTo?.name || "Not assigned"}
                        </p>

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