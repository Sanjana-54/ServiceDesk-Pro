import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const TechnicianDashboard = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // FETCH ASSIGNED TICKETS
  // ================================
  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Fetch assigned tickets error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch assigned tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // UPDATE TICKET STATUS
  // ================================
  const updateStatus = async (ticketId, status) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, {
        status,
      });

      await fetchAssignedTickets();
    } catch (error) {
      console.error("Update ticket status error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update ticket status"
      );
    }
  };

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ================================
  // LOAD TICKETS
  // ================================
  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  // ================================
  // COUNTS
  // ================================
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  ).length;

  const highPriorityTickets = tickets.filter(
    (ticket) =>
      ticket.priority === "High" ||
      ticket.priority === "Critical"
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        {/* BRAND */}
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


        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <button
            onClick={() => navigate("/technician")}
            className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-[#172554] to-[#243b78] px-4 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <span className="text-base">▣</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/technician")}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#172554]"
          >
            <span className="text-base">✓</span>
            Assigned Tickets
          </button>


          {/* SUPPORT STATUS */}
          <div className="mt-10 px-3">

            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              IT Support Online
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Manage assigned tickets and keep their status updated.
            </p>

          </div>

        </div>


        {/* USER */}
        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#172554] text-sm font-bold text-white">
              T
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Technician
              </p>

              <p className="text-xs text-slate-400">
                Technician
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}
      <main className="lg:ml-64">

        {/* =====================================================
            TOP BAR
        ====================================================== */}
        <header className="border-b border-slate-200 bg-white">

          <div className="flex items-center justify-between px-5 py-5 sm:px-8">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#ef5b73]">
                Technician Portal
              </p>

              <h1 className="mt-1 text-2xl font-bold text-[#172554] sm:text-3xl">
                Good to see you, Technician
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your assigned support tickets and resolve issues.
              </p>
            </div>


            {/* DESKTOP USER */}
            <div className="hidden items-center gap-3 sm:flex">

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">
                  Technician
                </p>

                <p className="text-xs text-slate-400">
                  Support Team
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">
                T
              </div>

            </div>

          </div>

        </header>


        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">


          {/* WELCOME BANNER */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#243b78] to-[#ef5b73] p-6 text-white shadow-lg sm:p-8">

            <div className="relative z-10 max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                Your workload
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Keep every ticket moving forward.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
                Review your assigned issues, prioritize urgent requests,
                and update ticket progress as you work.
              </p>

            </div>

            <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5"></div>

          </div>


          {/* =====================================================
              STATISTICS
          ====================================================== */}
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Assigned Tickets
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#172554]">
                    {totalTickets}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#172554]/10 text-lg text-[#172554]">
                  ✓
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Total tickets assigned to you
              </p>

            </div>


            {/* OPEN */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Open
                  </p>

                  <p className="mt-3 text-3xl font-bold text-blue-600">
                    {openTickets}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
                  ○
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Tickets waiting to be worked on
              </p>

            </div>


            {/* IN PROGRESS */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-3 text-3xl font-bold text-amber-600">
                    {inProgressTickets}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-600">
                  ◐
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Tickets currently being handled
              </p>

            </div>


            {/* RESOLVED */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resolved
                  </p>

                  <p className="mt-3 text-3xl font-bold text-emerald-600">
                    {resolvedTickets}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                  ✓
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400">
                Successfully resolved tickets
              </p>

            </div>

          </div>


          {/* =====================================================
              HIGH PRIORITY ALERT
          ====================================================== */}
          {highPriorityTickets > 0 && (

            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-600">
                !
              </div>

              <div>
                <p className="font-bold text-orange-800">
                  High-priority tickets need attention
                </p>

                <p className="mt-1 text-sm text-orange-700">
                  You currently have{" "}
                  <span className="font-bold">
                    {highPriorityTickets}
                  </span>{" "}
                  high-priority ticket
                  {highPriorityTickets !== 1 ? "s" : ""} assigned to you.
                </p>
              </div>

            </div>

          )}


          {/* =====================================================
              ASSIGNED TICKETS
          ====================================================== */}
          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* SECTION HEADER */}
            <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-xl font-bold text-[#172554]">
                    Assigned Tickets
                  </h2>

                  <span className="rounded-full bg-[#172554]/10 px-2.5 py-1 text-xs font-bold text-[#172554]">
                    {totalTickets}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Review and update the tickets assigned to you.
                </p>

              </div>


              <button
                onClick={fetchAssignedTickets}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#172554] hover:bg-slate-50 hover:text-[#172554] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↻ Refresh
              </button>

            </div>


            {/* LOADING */}
            {loading ? (

              <div className="p-14 text-center">

                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#ef5b73]"></div>

                <p className="mt-4 text-sm text-slate-500">
                  Loading assigned tickets...
                </p>

              </div>

            ) : tickets.length === 0 ? (

              /* EMPTY */
              <div className="p-14 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                  ✓
                </div>

                <h3 className="mt-4 font-bold text-slate-700">
                  No tickets assigned
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  New tickets assigned to you will appear here.
                </p>

              </div>

            ) : (

              /* TICKETS */
              <div>

                {tickets.map((ticket) => (

                  <div
                    key={ticket._id}
                    className="border-b border-slate-100 p-5 last:border-b-0 sm:p-6"
                  >

                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                      {/* TICKET INFORMATION */}
                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold text-slate-800">
                            {ticket.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              ticket.status === "Resolved"
                                ? "bg-emerald-100 text-emerald-700"
                                : ticket.status === "In Progress"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {ticket.status}
                          </span>

                          {(ticket.priority === "High" ||
                            ticket.priority === "Critical") && (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                              {ticket.priority}
                            </span>
                          )}

                        </div>


                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {ticket.description}
                        </p>


                        {/* DETAILS */}
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">

                          <div>
                            <span className="font-bold text-slate-700">
                              Category
                            </span>
                            <span className="ml-2">
                              {ticket.category || "Other"}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-700">
                              Priority
                            </span>

                            <span
                              className={`ml-2 ${
                                ticket.priority === "High" ||
                                ticket.priority === "Critical"
                                  ? "font-bold text-red-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-700">
                              Employee
                            </span>

                            <span className="ml-2">
                              {ticket.createdBy?.name || "Unknown"}
                            </span>
                          </div>

                        </div>

                      </div>


                      {/* STATUS CONTROL */}
                      <div className="w-full shrink-0 xl:w-56">

                        <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
                          Update Status
                        </label>

                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateStatus(
                              ticket._id,
                              e.target.value
                            )
                          }
                          disabled={ticket.status === "Resolved"}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#ef5b73] focus:ring-2 focus:ring-[#ef5b73]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

                        </select>

                        {ticket.status === "Resolved" && (
                          <p className="mt-2 text-xs font-medium text-emerald-600">
                            ✓ Ticket resolved
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* FOOTER */}
          <div className="py-8 text-center text-xs text-slate-400">
            ServiceDesk Pro · Technician Workspace
          </div>

        </div>

      </main>

    </div>
  );
};

export default TechnicianDashboard;
