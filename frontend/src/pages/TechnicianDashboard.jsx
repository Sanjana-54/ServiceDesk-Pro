import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load assigned tickets."
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

  const handleStatusChange = async (ticketId, status) => {
    try {
      await api.patch(`/tickets/${ticketId}/status`, {
        status,
      });

      await fetchTickets();

      if (selectedTicket?._id === ticketId) {
        const response = await api.get(
          `/tickets/${ticketId}`
        );

        setSelectedTicket(response.data.ticket);
      }
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update ticket status."
      );
    }
  };

  const openTicket = async (ticketId) => {
    try {
      const response = await api.get(
        `/tickets/${ticketId}`
      );

      setSelectedTicket(response.data.ticket);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to open ticket."
      );
    }
  };

  const closeTicket = () => {
    setSelectedTicket(null);
    setComment("");
  };

  const addComment = async () => {
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      setCommentLoading(true);

      const response = await api.post(
        `/tickets/${selectedTicket._id}/comments`,
        {
          message: comment.trim(),
        }
      );

      setSelectedTicket((previous) => ({
        ...previous,
        comments: response.data.comments,
      }));

      setComment("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const scrollToAssignedTickets = () => {
    document
      .getElementById("assigned-tickets")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) =>
      ticket.status === "Open" ||
      ticket.status === "Assigned"
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

  const getStatusClass = (status) => {
    if (status === "Open") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "In Progress") {
      return "border-orange-200 bg-orange-50 text-orange-600";
    }

    if (status === "Resolved") {
      return "border-emerald-200 bg-emerald-50 text-emerald-600";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
  };

  const getPriorityClass = (priority) => {
    if (priority === "Critical") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (priority === "High") {
      return "bg-red-50 text-red-500 border-red-200";
    }

    if (priority === "Medium") {
      return "bg-orange-50 text-orange-600 border-orange-200";
    }

    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-[#14213d]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[265px] border-r border-slate-200 bg-white lg:flex lg:flex-col">

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

            {/* DASHBOARD */}

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="flex w-full items-center gap-3 rounded-xl bg-[#243b76] px-4 py-3 text-left text-sm font-semibold text-white shadow-md shadow-[#243b76]/15"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                ▦
              </span>

              Dashboard
            </button>


            {/* ASSIGNED TICKETS */}

            <button
              type="button"
              onClick={scrollToAssignedTickets}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#f1f4fa] hover:text-[#243b76]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                ✓
              </span>

              Assigned Tickets
            </button>

          </nav>

        </div>


        {/* USER */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">

              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "T"}

            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-[#14213d]">
                {user?.name || "Technician"}
              </p>

              <p className="text-xs text-slate-500">
                Technician
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

      <main className="min-h-screen lg:ml-[265px]">

        {/* TOP HEADER */}

        <header className="border-b border-slate-200 bg-white">

          <div className="flex min-h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ef5b73]">
                Technician Portal
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Manage your assigned support tickets
              </p>

            </div>


            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-semibold text-[#14213d]">
                  {user?.name || "Technician"}
                </p>

                <p className="text-xs text-slate-500">
                  Support Team
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#172554] to-[#ef5b73] text-sm font-bold text-white">

                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "T"}

              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="mx-auto max-w-[1450px] px-5 py-7 sm:px-8 lg:px-10">

          {/* HEADING */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="mb-1 text-sm font-semibold text-[#ef5b73]">
                Technician Dashboard
              </p>

              <h2 className="text-3xl font-extrabold tracking-tight text-[#14213d] sm:text-4xl">
                Good to see you,{" "}
                {user?.name || "Technician"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Manage your assigned support tickets and resolve issues.
              </p>

            </div>


            <button
              type="button"
              onClick={fetchTickets}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#243b76] hover:text-[#243b76]"
            >
              ↻ Refresh
            </button>

          </div>


          {/* HERO */}

          <section className="relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#172554] via-[#44376f] to-[#ef5b73] px-8 py-7 text-white shadow-lg">

            <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute bottom-[-100px] right-24 h-48 w-48 rounded-full bg-white/10" />

            <div className="relative">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
                Your Workload
              </p>

              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Keep every ticket moving forward.
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
                Review assigned issues, prioritize urgent requests, and update ticket progress as you work.
              </p>

            </div>

          </section>


          {/* STATS */}

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* ASSIGNED */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Assigned Tickets
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#14213d]">
                    {totalTickets}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0f7] text-lg text-[#243b76]">
                  ✓
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Total tickets assigned to you
              </p>

            </div>


            {/* OPEN */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Open
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-[#2864e8]">
                    {openTickets}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-[#2864e8]">
                  ◯
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Tickets waiting to be worked on
              </p>

            </div>


            {/* PROGRESS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    In Progress
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-orange-600">
                    {inProgressTickets}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-lg text-orange-600">
                  ◐
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Tickets currently being handled
              </p>

            </div>


            {/* RESOLVED */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Resolved
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                    {resolvedTickets}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                  ✓
                </div>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                Successfully resolved tickets
              </p>

            </div>

          </section>


          {/* HIGH PRIORITY */}

          {highPriorityTickets > 0 && (

            <div className="mb-7 flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg font-bold text-orange-600">
                !
              </div>

              <div>

                <p className="text-base font-bold text-orange-800">
                  High-priority tickets need attention
                </p>

                <p className="mt-1 text-sm text-orange-600">
                  You currently have{" "}
                  {highPriorityTickets} high-priority ticket
                  {highPriorityTickets !== 1 ? "s" : ""} assigned to you.
                </p>

              </div>

            </div>

          )}


          {/* ASSIGNED TICKETS */}

          <section
            id="assigned-tickets"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            {/* HEADER */}

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <h3 className="text-xl font-extrabold text-[#14213d]">
                    Assigned Tickets
                  </h3>

                  <span className="rounded-full bg-[#eef0f7] px-2.5 py-1 text-xs font-bold text-[#243b76]">
                    {tickets.length}
                  </span>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Review and update the tickets assigned to you.
                </p>

              </div>


              <button
                type="button"
                onClick={fetchTickets}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-[#243b76] hover:text-[#243b76]"
              >
                ↻ Refresh
              </button>

            </div>


            {/* LOADING */}

            {loading ? (

              <div className="flex min-h-[300px] flex-col items-center justify-center">

                <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#243b76]" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading assigned tickets...
                </p>

              </div>

            ) : tickets.length === 0 ? (

              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef0f7] text-2xl text-[#243b76]">
                  ✓
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#14213d]">
                  No assigned tickets
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  There are currently no tickets assigned to you.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {tickets.map((ticket) => (

                  <div
                    key={ticket._id}
                    className="p-6 transition hover:bg-[#fafbfe]"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                      {/* INFORMATION */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h4 className="text-lg font-bold text-[#14213d]">
                            {ticket.title}
                          </h4>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                              ticket.status
                            )}`}
                          >
                            {ticket.status}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityClass(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>

                        </div>


                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                          {ticket.description}
                        </p>


                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">

                          <span>
                            <strong className="text-slate-700">
                              Category
                            </strong>{" "}
                            {ticket.category || "Other"}
                          </span>

                          <span>
                            <strong className="text-slate-700">
                              Employee
                            </strong>{" "}
                            {ticket.createdBy?.name || "Unknown"}
                          </span>

                          <span>
                            <strong className="text-slate-700">
                              Priority
                            </strong>{" "}
                            {ticket.priority}
                          </span>

                        </div>


                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            openTicket(ticket._id)
                          }
                          className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#243b76] hover:text-[#243b76]"
                        >
                          View Ticket
                        </button>

                      </div>


                      {/* STATUS */}

                      <div className="w-full xl:w-[220px]">

                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Update Status
                        </label>

                        <div className="relative">

                          <select
                            value={ticket.status}
                            onChange={(e) =>
                              handleStatusChange(
                                ticket._id,
                                e.target.value
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#243b76] focus:ring-4 focus:ring-[#243b76]/10"
                          >

                            <option value="Open">
                              Open
                            </option>

                            <option value="In Progress">
                              In Progress
                            </option>

                            <option value="Resolved">
                              Resolved
                            </option>

                          </select>

                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            ▼
                          </div>

                        </div>


                        {ticket.status === "Resolved" && (

                          <p className="mt-2 text-xs font-semibold text-emerald-600">
                            ✓ Ticket resolved
                          </p>

                        )}

                        {ticket.status === "In Progress" && (

                          <p className="mt-2 text-xs font-semibold text-orange-600">
                            ◐ Work in progress
                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

      </main>


      {/* TICKET DETAILS MODAL */}

      {selectedTicket && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14213d]/40 p-4">

          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-extrabold text-[#14213d]">
                    {selectedTicket.title}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedTicket.category} •{" "}
                  {selectedTicket.priority}
                </p>

              </div>


              <button
                type="button"
                onClick={closeTicket}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="overflow-y-auto p-6">

              {/* DESCRIPTION */}

              <div className="rounded-xl bg-[#f7f8fb] p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Issue Description
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selectedTicket.description}
                </p>

              </div>


              {/* STATUS */}

              <div className="mt-5">

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Update Ticket Status
                </p>

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        selectedTicket._id,
                        "In Progress"
                      )
                    }
                    className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-100"
                  >
                    ◐ In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusChange(
                        selectedTicket._id,
                        "Resolved"
                      )
                    }
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
                  >
                    ✓ Mark Resolved
                  </button>

                </div>

              </div>


              {/* COMMENTS */}

              <div className="mt-7">

                <h3 className="text-base font-extrabold text-[#14213d]">
                  Communication
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Communicate with the employee about the issue.
                </p>


                <div className="mt-4 space-y-3">

                  {selectedTicket.comments?.length > 0 ? (

                    selectedTicket.comments.map((item) => (

                      <div
                        key={item._id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >

                        <div className="flex justify-between gap-3">

                          <p className="text-xs font-bold text-[#14213d]">
                            {item.user?.name || "User"}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleString()
                              : ""}
                          </p>

                        </div>

                        <p className="mt-2 text-sm leading-5 text-slate-600">
                          {item.message}
                        </p>

                      </div>

                    ))

                  ) : (

                    <div className="rounded-xl bg-[#f7f8fb] p-4 text-xs text-slate-500">
                      No comments yet.
                    </div>

                  )}

                </div>


                <div className="mt-4 flex gap-2">

                  <input
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addComment();
                      }
                    }}
                    placeholder="Write a message to the employee..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#243b76] focus:ring-4 focus:ring-[#243b76]/10"
                  />

                  <button
                    type="button"
                    disabled={commentLoading}
                    onClick={addComment}
                    className="rounded-xl bg-[#243b76] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {commentLoading
                      ? "Sending..."
                      : "Send"}
                  </button>

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="border-t border-slate-100 bg-[#fafbfc] px-6 py-4 text-right">

              <button
                type="button"
                onClick={closeTicket}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default TechnicianDashboard;