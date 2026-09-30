import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);

  // ================================
  // FETCH ASSIGNED TICKETS
  // ================================

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error("Fetch tickets error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load assigned tickets"
      );
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ================================
  // UPDATE TICKET STATUS
  // ================================

  const updateStatus = async (ticketId, status) => {
    try {
      await api.patch(
        `/tickets/${ticketId}/status`,
        { status }
      );

      await fetchTickets();
    } catch (error) {
      console.error("Update status error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update ticket"
      );
    }
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================================
  // TICKET STATISTICS
  // ================================

  const pendingCount = tickets.filter(
    (ticket) =>
      ticket.status === "Assigned" ||
      ticket.status === "Open"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved"
  ).length;

  return (
    <div className="tech-page">

      {/* ================================
          HEADER
      ================================= */}

      <header className="tech-header">

        <div className="tech-brand">

          <h1>ServiceDesk Pro</h1>

          <p>Technician Dashboard</p>

        </div>

        <div className="tech-user">

          <span>
            Welcome, {user?.name || "Technician"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="tech-container">

        {/* PAGE TITLE */}

        <div className="page-title">

          <h2>
            Assigned Tickets
          </h2>

          <p>
            Manage and resolve your assigned
            support tickets.
          </p>

        </div>

        {/* ================================
            STATISTICS
        ================================= */}

        <div className="tech-stats">

          {/* PENDING */}

          <div className="tech-stat-card">

            <span className="stat-label">
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>

            <small>
              Tickets waiting for action
            </small>

          </div>

          {/* IN PROGRESS */}

          <div className="tech-stat-card">

            <span className="stat-label">
              In Progress
            </span>

            <strong>
              {inProgressCount}
            </strong>

            <small>
              Currently being worked on
            </small>

          </div>

          {/* RESOLVED */}

          <div className="tech-stat-card">

            <span className="stat-label">
              Resolved
            </span>

            <strong>
              {resolvedCount}
            </strong>

            <small>
              Successfully completed
            </small>

          </div>

        </div>

        {/* ================================
            TICKETS
        ================================= */}

        {tickets.length === 0 ? (

          <div className="empty-state">

            <h3>
              No tickets assigned
            </h3>

            <p>
              You currently don't have any
              tickets assigned to you.
            </p>

          </div>

        ) : (

          <div className="tech-ticket-grid">

            {tickets.map((ticket) => (

              <div
                className="tech-ticket-card"
                key={ticket._id}
              >

                {/* TICKET HEADER */}

                <div className="ticket-card-header">

                  <div>

                    <h3>
                      {ticket.title}
                    </h3>

                    <span className="ticket-category">
                      {ticket.category || "Other"}
                    </span>

                  </div>

                  <span
                    className={`priority ${
                      ticket.priority
                        ?.toLowerCase()
                        .replace(/\s+/g, "-") ||
                      "medium"
                    }`}
                  >
                    {ticket.priority || "Medium"}
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="ticket-description">
                  {ticket.description}
                </p>

                {/* TICKET INFORMATION */}

                <div className="ticket-info">

                  <p>

                    <strong>
                      Created By:
                    </strong>

                    <span>
                      {ticket.createdBy?.name ||
                        "Unknown"}
                    </span>

                  </p>

                  <p>

                    <strong>
                      Email:
                    </strong>

                    <span>
                      {ticket.createdBy?.email ||
                        "N/A"}
                    </span>

                  </p>

                  <p>

                    <strong>
                      Status:
                    </strong>

                    <span className="status-badge">
                      {ticket.status || "Open"}
                    </span>

                  </p>

                </div>

                {/* STATUS UPDATE */}

                <div className="ticket-actions">

                  <label htmlFor={`status-${ticket._id}`}>
                    Update Status
                  </label>

                  <select
                    id={`status-${ticket._id}`}
                    value={ticket.status}
                    onChange={(e) =>
                      updateStatus(
                        ticket._id,
                        e.target.value
                      )
                    }
                    disabled={
                      ticket.status === "Resolved"
                    }
                  >

                    {ticket.status === "Assigned" && (
                      <option value="Assigned">
                        Assigned
                      </option>
                    )}

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default TechnicianDashboard;