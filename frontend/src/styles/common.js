// ================================
// ServiceDesk Pro - Common Styles
// ================================

// ---------- Layout ----------

export const pageBackground =
  "min-h-screen bg-[#f5f7fb]";

export const pageWrapper =
  "min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8";

export const contentWrapper =
  "mx-auto w-full max-w-7xl";


// ---------- Cards ----------

export const card =
  "rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]";

export const formCard =
  "w-full max-w-[440px] rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-10";


// ---------- Typography ----------

export const pageTitle =
  "text-3xl font-bold tracking-tight text-[#111827]";

export const heading =
  "text-2xl font-bold tracking-tight text-[#111827]";

export const subHeading =
  "text-base font-semibold text-[#374151]";

export const bodyText =
  "text-sm leading-relaxed text-[#6b7280]";

export const mutedText =
  "text-xs text-[#9ca3af]";

export const linkText =
  "font-semibold text-[#4f46e5] transition-colors hover:text-[#4338ca]";


// ---------- Brand ----------

export const brandContainer =
  "mb-8 flex items-center gap-3.5";

export const brandIcon =
  "flex h-12 w-12 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-[15px] font-extrabold text-white shadow-[0_8px_18px_rgba(79,70,229,0.25)]";

export const brandTitle =
  "text-[21px] font-semibold text-[#111827]";

export const brandSubtitle =
  "mt-0.5 text-xs text-[#9ca3af]";


// ---------- Forms ----------

export const form =
  "flex flex-col gap-5";

export const formGroup =
  "flex flex-col gap-2";

export const label =
  "text-[13px] font-semibold text-[#374151]";

export const inputWrapper =
  "relative flex items-center";

export const input =
  "h-12 w-full rounded-[9px] border border-[#d1d5db] bg-white px-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] hover:border-[#9ca3af] focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10";

export const inputWithIcon =
  "h-12 w-full rounded-[9px] border border-[#d1d5db] bg-white pl-[42px] pr-3.5 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] hover:border-[#9ca3af] focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10";

export const inputIcon =
  "pointer-events-none absolute left-3.5 text-sm text-[#9ca3af]";


// ---------- Buttons ----------

export const primaryButton =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-[9px] border-0 bg-[#4f46e5] text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#4338ca] hover:shadow-[0_8px_18px_rgba(79,70,229,0.2)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70";

export const secondaryButton =
  "rounded-lg border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]";

export const ghostButton =
  "text-sm font-medium text-[#4f46e5] transition-colors hover:text-[#4338ca]";


// ---------- Password ----------

export const passwordToggle =
  "absolute right-2.5 rounded-md border-0 bg-[#f3f4f6] px-2 py-1.5 text-[11px] font-semibold text-[#4f46e5] transition-colors hover:bg-[#e5e7eb]";


// ---------- Error ----------

export const errorBox =
  "flex items-center gap-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2.5 text-[13px] text-[#b91c1c]";


// ---------- Register / Footer ----------

export const dividerSection =
  "mt-7 flex items-center justify-center gap-1 border-t border-[#e5e7eb] pt-5 text-[13px] text-[#6b7280]";

export const securityText =
  "mt-5 text-center text-[11px] text-[#9ca3af]";


// ---------- Loading ----------

export const spinner =
  "h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white";import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import {
  pageBackground,
  contentWrapper,
  card,
  pageTitle,
  bodyText,
  primaryButton,
  secondaryButton,
  mutedText,
} from "../styles/common";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch employee tickets
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

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Create ticket
  const handleCreateTicket = () => {
    navigate("/create-ticket");
  };

  // Ticket statistics
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

  // Status styles
  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-50 text-blue-700";

      case "Assigned":
        return "bg-purple-50 text-purple-700";

      case "In Progress":
        return "bg-amber-50 text-amber-700";

      case "Resolved":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Priority styles
  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700";

      case "medium":
        return "bg-amber-50 text-amber-700";

      case "low":
        return "bg-green-50 text-green-700";

      case "critical":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className={pageBackground}>

      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-[#e5e7eb] bg-white lg:flex lg:flex-col">

        {/* Logo */}

        <div className="flex items-center gap-3 border-b border-[#edf0f4] px-6 py-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(79,70,229,0.2)]">
            SD
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              ServiceDesk
            </h2>

            <span className="text-xs font-semibold text-[#4f46e5]">
              Pro
            </span>
          </div>

        </div>

        {/* Navigation */}

        <nav className="flex flex-1 flex-col gap-2 px-4 py-6">

          <button
            className="flex items-center gap-3 rounded-lg bg-[#eef2ff] px-4 py-3 text-sm font-semibold text-[#4f46e5]"
          >
            <span className="text-base">▦</span>
            Dashboard
          </button>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#f5f7fb] hover:text-[#4f46e5]"
            onClick={() => navigate("/my-tickets")}
          >
            <span className="text-base">▤</span>
            My Tickets
          </button>

          <button
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#667085] transition-colors hover:bg-[#f5f7fb] hover:text-[#4f46e5]"
            onClick={handleCreateTicket}
          >
            <span className="text-base">＋</span>
            Create Ticket
          </button>

        </nav>

        {/* User */}

        <div className="border-t border-[#edf0f4] p-4">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-bold text-[#4f46e5]">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="min-w-0">

              <strong className="block truncate text-sm text-[#111827]">
                {user?.name || "User"}
              </strong>

              <span className="text-xs text-[#9ca3af]">
                Employee
              </span>

            </div>

          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-2.5 text-sm font-semibold text-[#b91c1c] transition-colors hover:bg-[#fee2e2]"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="min-h-screen lg:pl-64">

        <div className={`${contentWrapper} px-4 py-6 sm:px-6 lg:px-8`}>

          {/* Header */}

          <header className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-center">

            <div>
              <h1 className={pageTitle}>
                Dashboard
              </h1>

              <p className={`${bodyText} mt-2`}>
                Manage your support requests and track their progress.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-bold text-[#4f46e5]">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="hidden sm:block">

                <strong className="block text-sm text-[#111827]">
                  {user?.name || "User"}
                </strong>

                <span className="text-xs text-[#9ca3af]">
                  Employee
                </span>

              </div>

            </div>

          </header>

          {/* Welcome */}

          <section className={`${card} mb-7 flex flex-col justify-between gap-6 p-6 sm:p-8 lg:flex-row lg:items-center`}>

            <div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#4f46e5]">
                Welcome back
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
                Hello, {user?.name || "there"} 👋
              </h2>

              <p className={`${bodyText} mt-2 max-w-xl`}>
                Need help with something? Create a support ticket and our team will take care of it.
              </p>

            </div>

            <button
              className={`${primaryButton} w-full px-5 lg:w-auto`}
              onClick={handleCreateTicket}
            >
              <span>＋</span>
              Create New Ticket
            </button>

          </section>

          {/* Statistics */}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

            <div className={`${card} flex items-center gap-4 p-5`}>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef2ff] text-xl text-[#4f46e5]">
                ▦
              </div>

              <div>
                <span className={mutedText}>
                  Total Tickets
                </span>

                <strong className="mt-1 block text-2xl font-bold text-[#111827]">
                  {tickets.length}
                </strong>
              </div>

            </div>

            {/* Open */}

            <div className={`${card} flex items-center gap-4 p-5`}>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-xl text-[#2563eb]">
                ◷
              </div>

              <div>
                <span className={mutedText}>
                  Open Tickets
                </span>

                <strong className="mt-1 block text-2xl font-bold text-[#111827]">
                  {openCount}
                </strong>
              </div>

            </div>

            {/* Progress */}

            <div className={`${card} flex items-center gap-4 p-5`}>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fffbeb] text-xl text-[#d97706]">
                ↻
              </div>

              <div>
                <span className={mutedText}>
                  In Progress
                </span>

                <strong className="mt-1 block text-2xl font-bold text-[#111827]">
                  {progressCount}
                </strong>
              </div>

            </div>

            {/* Resolved */}

            <div className={`${card} flex items-center gap-4 p-5`}>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0fdf4] text-xl text-[#16a34a]">
                ✓
              </div>

              <div>
                <span className={mutedText}>
                  Resolved
                </span>

                <strong className="mt-1 block text-2xl font-bold text-[#111827]">
                  {resolvedCount}
                </strong>
              </div>

            </div>

          </section>

          {/* Tickets */}

          <section className={`${card} overflow-hidden`}>

            {/* Section Header */}

            <div className="flex flex-col justify-between gap-4 border-b border-[#edf0f4] p-6 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  My Recent Tickets
                </h2>

                <p className={`${bodyText} mt-1`}>
                  Track the status of your support requests.
                </p>
              </div>

              <button
                className={secondaryButton}
                onClick={fetchTickets}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>

            </div>

            {/* Loading */}

            {loading ? (

              <div className="flex flex-col items-center justify-center px-6 py-16">

                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e5e7eb] border-t-[#4f46e5]"></div>

                <p className={`${bodyText} mt-4`}>
                  Loading your tickets...
                </p>

              </div>

            ) : tickets.length === 0 ? (

              /* Empty */

              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-2xl text-[#4f46e5]">
                  ◫
                </div>

                <h3 className="text-lg font-bold text-[#111827]">
                  No tickets yet
                </h3>

                <p className={`${bodyText} mt-1`}>
                  You haven't created any support tickets.
                </p>

                <button
                  onClick={handleCreateTicket}
                  className={`${primaryButton} mt-5 w-auto px-5`}
                >
                  Create Your First Ticket
                </button>

              </div>

            ) : (

              /* Ticket List */

              <div className="divide-y divide-[#edf0f4]">

                {tickets.map((ticket) => (

                  <div
                    className="flex flex-col gap-6 p-6 transition-colors hover:bg-[#fafbfc] lg:flex-row lg:items-center lg:justify-between"
                    key={ticket._id}
                  >

                    {/* Ticket Details */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                        <h3 className="text-base font-bold text-[#111827]">
                          {ticket.title}
                        </h3>

                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusClass(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#667085]">
                        {ticket.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#667085]">

                        <span>
                          <strong className="text-[#344054]">
                            Category:
                          </strong>{" "}
                          {ticket.category || "Other"}
                        </span>

                        <span className="flex items-center gap-1">
                          <strong className="text-[#344054]">
                            Priority:
                          </strong>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getPriorityClass(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority || "Medium"}
                          </span>
                        </span>

                      </div>

                    </div>

                    {/* Technician */}

                    <div className="border-t border-[#edf0f4] pt-4 lg:min-w-[180px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                      <span className="block text-xs text-[#9ca3af]">
                        Assigned Technician
                      </span>

                      <strong className="mt-1 block text-sm text-[#344054]">
                        {ticket.assignedTo?.name ||
                          "Not assigned"}
                      </strong>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default EmployeeDashboard;