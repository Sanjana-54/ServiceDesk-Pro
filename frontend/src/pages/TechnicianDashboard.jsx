import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);

  // Fetch tickets assigned to technician
  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets/assigned");

      setTickets(response.data.tickets);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load assigned tickets"
      );
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update ticket status
  const updateStatus = async (ticketId, status) => {
    try {
      await api.patch(
        `/tickets/${ticketId}/status`,
        { status }
      );

      fetchTickets();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update ticket"
      );
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Ticket statistics
  const inProgressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved"
  ).length;

  const pendingCount = tickets.filter(
    (ticket) =>
      ticket.status === "Assigned" ||
      ticket.status === "Open"
  ).length;

  return (
    <div className="tech-page">

      {/* ================= HEADER ================= */}

      <header className="tech-header">

        <div>
          <h1>ServiceDesk Pro</h1>
          <p>Technician Dashboard</p>
        </div>

        <div className="tech-user">

          <span>
            Welcome, {user?.name}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================= MAIN CONTENT ================= */}

      <main className="tech-container">

        {/* Page Title */}

        <div className="page-title">

          <h2>
            Assigned Tickets
          </h2>

          <p>
            Manage and resolve your assigned
            support tickets.
          </p>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="tech-stats">

          {/* Pending */}

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

          {/* In Progress */}

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

          {/* Resolved */}

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

        {/* ================= TICKETS ================= */}

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

                {/* Ticket Header */}

                <div className="ticket-card-header">

                  <div>

                    <h3>
                      {ticket.title}
                    </h3>

                    <span className="ticket-category">
                      {ticket.category}
                    </span>

                  </div>

                  <span
                    className={`priority ${
                      ticket.priority
                        ?.toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {ticket.priority}
                  </span>

                </div>

                {/* Description */}

                <p className="ticket-description">
                  {ticket.description}
                </p>

                {/* Ticket Information */}

                <div className="ticket-info">

                  <p>
                    <strong>
                      Created By:
                    </strong>{" "}
                    {ticket.createdBy?.name ||
                      "Unknown"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {ticket.createdBy?.email ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}

                    <span className="status-badge">
                      {ticket.status}
                    </span>

                  </p>

                </div>

                {/* Status Update */}

                <div className="ticket-actions">

                  <label>
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
                  >

                    <option value="Assigned">
                      Assigned
                    </option>

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