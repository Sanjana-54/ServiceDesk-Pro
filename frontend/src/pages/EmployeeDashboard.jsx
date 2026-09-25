import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import "./EmployeeDashboard.css";

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

  const handleCreateTicket = () => {
    navigate("/create-ticket");
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "status-open";

      case "Assigned":
        return "status-assigned";

      case "In Progress":
        return "status-progress";

      case "Resolved":
        return "status-resolved";

      default:
        return "status-default";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "priority-high";

      case "medium":
        return "priority-medium";

      case "low":
        return "priority-low";

      default:
        return "priority-default";
    }
  };

  return (
    <div className="employee-page">

      {/* Sidebar */}

      <aside className="employee-sidebar">

        <div className="employee-logo">

          <div className="employee-logo-icon">
            SD
          </div>

          <div>
            <h2>ServiceDesk</h2>
            <span>Pro</span>
          </div>

        </div>

        <nav className="employee-nav">

          <button className="nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button
  className="nav-item"
  onClick={() => navigate("/my-tickets")}
>
  <span>▤</span>
  My Tickets
</button>

          <button
            className="nav-item"
            onClick={handleCreateTicket}
          >
            <span>＋</span>
            Create Ticket
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="sidebar-user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                Employee
              </span>
            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* Main */}

      <main className="employee-main">

        {/* Top Header */}

        <header className="employee-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Manage your support requests
              and track their progress.
            </p>
          </div>

          <div className="header-user">

            <div className="header-avatar">
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                Employee
              </span>
            </div>

          </div>

        </header>

        {/* Welcome */}

        <section className="employee-welcome">

          <div>
            <p className="welcome-label">
              Welcome back
            </p>

            <h2>
              Hello, {user?.name || "there"} 👋
            </h2>

            <p>
              Need help with something?
              Create a support ticket and
              our team will take care of it.
            </p>
          </div>

          <button
            className="create-ticket-button"
            onClick={handleCreateTicket}
          >
            <span>＋</span>
            Create New Ticket
          </button>

        </section>

        {/* Statistics */}

        <section className="employee-stats">

          <div className="stat-card">

            <div className="stat-icon total">
              ▦
            </div>

            <div>
              <span>Total Tickets</span>
              <strong>{tickets.length}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon open">
              ◷
            </div>

            <div>
              <span>Open Tickets</span>
              <strong>{openCount}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon progress">
              ↻
            </div>

            <div>
              <span>In Progress</span>
              <strong>{progressCount}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon resolved">
              ✓
            </div>

            <div>
              <span>Resolved</span>
              <strong>{resolvedCount}</strong>
            </div>

          </div>

        </section>

        {/* Tickets */}

        <section className="tickets-section">

          <div className="section-heading">

            <div>
              <h2>My Recent Tickets</h2>

              <p>
                Track the status of your
                support requests.
              </p>
            </div>

            <button
              className="view-all-button"
              onClick={fetchTickets}
            >
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="employee-empty">

              <div className="loading-spinner"></div>

              <p>
                Loading your tickets...
              </p>

            </div>
          ) : tickets.length === 0 ? (

            <div className="employee-empty">

              <div className="empty-icon">
                ◫
              </div>

              <h3>
                No tickets yet
              </h3>

              <p>
                You haven't created any
                support tickets.
              </p>

              <button
                onClick={handleCreateTicket}
                className="empty-create-button"
              >
                Create Your First Ticket
              </button>

            </div>

          ) : (

            <div className="employee-ticket-list">

              {tickets.map((ticket) => (

                <div
                  className="employee-ticket-card"
                  key={ticket._id}
                >

                  <div className="ticket-main">

                    <div className="ticket-title-row">

                      <h3>
                        {ticket.title}
                      </h3>

                      <span
                        className={`ticket-status ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>

                    </div>

                    <p className="employee-ticket-description">
                      {ticket.description}
                    </p>

                    <div className="ticket-meta">

                      <span>
                        <strong>
                          Category:
                        </strong>{" "}
                        {ticket.category || "General"}
                      </span>

                      <span>
                        <strong>
                          Priority:
                        </strong>{" "}
                        <span
                          className={`ticket-priority ${getPriorityClass(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority || "Normal"}
                        </span>
                      </span>

                    </div>

                  </div>

                  <div className="ticket-assignee">

                    <span>
                      Assigned Technician
                    </span>

                    <strong>
                      {ticket.assignedTo?.name ||
                        "Not assigned"}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default EmployeeDashboard;