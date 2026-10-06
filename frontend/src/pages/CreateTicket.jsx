import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

function CreateTicket() {
  const navigate = useNavigate();
  const user = getUser();

  const [form, setForm] = useState({
    title: "",
    category: "Other",
    priority: "Medium",
    description: "",
  });

  const [evidence, setEvidence] = useState({
    fileName: "",
    fileType: "",
    fileUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEvidenceChange = (e) => {
    const { name, value } = e.target;

    setEvidence((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a ticket title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please describe your issue.");
      return;
    }

    if (
      evidence.fileUrl.trim() &&
      !evidence.fileName.trim()
    ) {
      alert("Please enter the evidence file name.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the ticket
      const response = await api.post("/tickets", {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        description: form.description.trim(),
      });

      const createdTicket = response.data.ticket;

      // 2. Add evidence if the employee provided a Drive link
      if (evidence.fileUrl.trim()) {
        try {
          await api.post(
            `/tickets/${createdTicket._id}/evidence`,
            {
              fileName:
                evidence.fileName.trim() ||
                "Supporting Evidence",

              fileType:
                evidence.fileType.trim() ||
                "Google Drive File",

              fileUrl: evidence.fileUrl.trim(),
            }
          );
        } catch (evidenceError) {
          console.error(
            "Evidence upload error:",
            evidenceError
          );

          alert(
            "Ticket was created, but the evidence could not be attached."
          );

          navigate("/my-tickets");
          return;
        }
      }

      alert("Ticket created successfully!");

      navigate("/my-tickets");
    } catch (error) {
      console.error("Create ticket error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to create ticket."
      );
    } finally {
      setLoading(false);
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

            {/* DASHBOARD */}

            <button
              type="button"
              onClick={() => navigate("/employee")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-[#fff0f3] hover:text-[#d83f5b]"
            >

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
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


            {/* CREATE TICKET - ACTIVE */}

            <button
              type="button"
              onClick={() => navigate("/create-ticket")}
              className="flex w-full items-center gap-3 rounded-xl bg-[#243b76] px-4 py-3 text-left text-sm font-semibold text-white shadow-md shadow-[#243b76]/15"
            >

              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-lg">
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

        {/* TOP HEADER */}

        <header className="border-b border-slate-200 bg-white">

          <div className="flex h-[76px] items-center justify-between px-5 sm:px-8 lg:px-10">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d83f5b]">
                Employee Portal
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a new support request
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

        <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10">

          {/* PAGE INTRO */}

          <div className="mb-7">

            <p className="text-sm font-semibold text-[#d83f5b]">
              Support Center
            </p>

            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-[#14213d]">
              Create a Support Ticket
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Tell us what you need help with and our IT support team will assist you.
            </p>

          </div>


          {/* FORM CARD */}

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >

            {/* FORM HEADER */}

            <div className="bg-gradient-to-r from-[#172554] to-[#243b76] px-7 py-6 text-white">

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/65">
                New Request
              </p>

              <h3 className="mt-2 text-2xl font-extrabold">
                Tell us about your issue
              </h3>

              <p className="mt-2 text-sm text-white/70">
                Provide enough information so the IT team can understand and resolve your problem quickly.
              </p>

            </div>


            {/* FORM BODY */}

            <div className="space-y-7 p-6 sm:p-8">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#14213d]">
                  Ticket Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Unable to access my account"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#14213d] outline-none transition placeholder:text-slate-400 focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                />

              </div>


              {/* CATEGORY + PRIORITY */}

              <div className="grid gap-6 md:grid-cols-2">

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-[#14213d]">
                    Category
                  </label>

                  <div className="relative">

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-[#14213d] outline-none transition focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                    >

                      <option value="Hardware">
                        Hardware
                      </option>

                      <option value="Software">
                        Software
                      </option>

                      <option value="Network">
                        Network
                      </option>

                      <option value="Access">
                        Access
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>


                    {/* DROPDOWN ARROW - MOVED INWARD */}

                    <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-slate-500">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>

                  </div>

                </div>


                {/* PRIORITY */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-[#14213d]">
                    Priority
                  </label>

                  <div className="relative">

                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-[#14213d] outline-none transition focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                    >

                      <option value="Low">
                        Low
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="High">
                        High
                      </option>

                      <option value="Critical">
                        Critical
                      </option>

                    </select>


                    {/* DROPDOWN ARROW */}

                    <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center text-slate-500">

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>

                    </div>

                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="mb-2 block text-sm font-bold text-[#14213d]">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your issue in detail..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-[#14213d] outline-none transition placeholder:text-slate-400 focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                />

              </div>


              {/* EVIDENCE */}

              <div className="border-t border-slate-100 pt-7">

                <div className="mb-4">

                  <div className="flex items-center gap-3">

                    <h3 className="text-base font-extrabold text-[#14213d]">
                      Supporting Evidence
                    </h3>

                    <span className="rounded-full bg-[#fff0f3] px-2.5 py-1 text-[10px] font-bold text-[#d83f5b]">
                      Optional
                    </span>

                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    If you have a screenshot, photo, PDF, error log, or other useful file, upload it to Google Drive and paste the shareable link below.
                  </p>

                </div>


                <div className="rounded-2xl border border-[#e5e9f1] bg-[#fafbfe] p-5">

                  {/* INFO */}

                  <div className="mb-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#243b76]">
                      ℹ
                    </div>

                    <div>

                      <p className="text-xs font-bold text-[#243b76]">
                        How to attach evidence
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Upload your file to Google Drive, set sharing to
                        <strong> “Anyone with the link”</strong>, then paste the link here.
                      </p>

                    </div>

                  </div>


                  <div className="grid gap-5 md:grid-cols-2">

                    {/* FILE NAME */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-[#14213d]">
                        File Name
                      </label>

                      <input
                        type="text"
                        name="fileName"
                        value={evidence.fileName}
                        onChange={handleEvidenceChange}
                        placeholder="e.g. wifi-error.png"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                      />

                    </div>


                    {/* FILE TYPE */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-[#14213d]">
                        File Type
                      </label>

                      <div className="relative">

                        <select
                          name="fileType"
                          value={evidence.fileType}
                          onChange={handleEvidenceChange}
                          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                        >

                          <option value="">
                            Select file type
                          </option>

                          <option value="Image">
                            Image / Screenshot
                          </option>

                          <option value="PDF">
                            PDF
                          </option>

                          <option value="Document">
                            Document
                          </option>

                          <option value="Video">
                            Video
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>


                        <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 text-slate-500">

                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* GOOGLE DRIVE URL */}

                  <div className="mt-5">

                    <label className="mb-2 block text-xs font-bold text-[#14213d]">
                      Google Drive Link
                    </label>

                    <input
                      type="url"
                      name="fileUrl"
                      value={evidence.fileUrl}
                      onChange={handleEvidenceChange}
                      placeholder="https://drive.google.com/..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#d83f5b] focus:ring-2 focus:ring-[#d83f5b]/10"
                    />

                    <p className="mt-2 text-[11px] text-slate-400">
                      Leave this empty if you do not have any supporting evidence.
                    </p>

                  </div>

                </div>

              </div>


              {/* ACTION BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate("/my-tickets")}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-[#172554] to-[#d83f5b] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#d83f5b]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating Ticket..."
                    : "Create Ticket"}
                </button>

              </div>

            </div>

          </form>

        </main>

      </div>

    </div>
  );
}

export default CreateTicket;