import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const fetchData = async () => {
    try {
      const [
        dashboardResponse,
        ticketsResponse,
        techniciansResponse,
      ] = await Promise.all([
        api.get("/dashboard/admin"),
        api.get("/tickets"),
        api.get("/users/technicians"),
      ]);

      setStats(
        dashboardResponse.data.stats
      );

      setTickets(
        ticketsResponse.data.tickets
      );

      setTechnicians(
        techniciansResponse.data.technicians
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load admin dashboard"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignTicket = async (
    ticketId,
    technicianId
  ) => {
    if (!technicianId) return;

    try {
      await api.patch(
        `/tickets/${ticketId}/assign`,
        {
          technicianId,
        }
      );

      alert(
        "Technician assigned successfully"
      );

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to assign ticket"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div>
          <h1>ServiceDesk Pro</h1>
          <p>System Administration</p>
        </div>

        <div className="admin-user">

          <span>
            Welcome, {user?.name}
          </span>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="admin-container">

        {/* Page Title */}

        <div className="admin-title">

          <h2>
            Admin Dashboard
          </h2>

          <p>
            Monitor users, tickets and
            technician assignments.
          </p>

        </div>

        {/* ================= STATISTICS ================= */}

        {stats && (
          <div className="admin-stats">

            <div className="admin-stat-card">
              <span>Total Users</span>

              <strong>
                {stats.totalUsers}
              </strong>

              <small>
                Registered users
              </small>
            </div>

            <div className="admin-stat-card">
              <span>Total Tickets</span>

              <strong>
                {stats.totalTickets}
              </strong>

              <small>
                All support tickets
              </small>
            </div>

            <div className="admin-stat-card">
              <span>Open Tickets</span>

              <strong>
                {stats.openTickets}
              </strong>

              <small>
                Tickets requiring attention
              </small>
            </div>

            <div className="admin-stat-card">
              <span>Resolved</span>

              <strong>
                {stats.resolvedTickets}
              </strong>

              <small>
                Completed tickets
              </small>
            </div>

            <div className="admin-stat-card">
              <span>Technicians</span>

              <strong>
                {stats.technicians}
              </strong>

              <small>
                Available technicians
              </small>
            </div>

          </div>
        )}

        {/* ================= TICKETS ================= */}

        <div className="tickets-section">

          <div className="section-heading">

            <div>
              <h2>
                All Tickets
              </h2>

              <p>
                Review and assign support tickets.
              </p>
            </div>

            <span className="ticket-count">
              {tickets.length} Tickets
            </span>

          </div>

          {tickets.length === 0 ? (

            <div className="admin-empty">

              <h3>
                No tickets available
              </h3>

              <p>
                There are currently no support
                tickets in the system.
              </p>

            </div>

          ) : (

            <div className="admin-ticket-grid">

              {tickets.map((ticket) => (

                <div
                  className="admin-ticket-card"
                  key={ticket._id}
                >

                  {/* Ticket Header */}

                  <div className="admin-ticket-header">

                    <div>

                      <h3>
                        {ticket.title}
                      </h3>

                      <span className="admin-category">
                        {ticket.category}
                      </span>

                    </div>

                    <span
                      className={`admin-priority ${
                        ticket.priority
                          ?.toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {ticket.priority}
                    </span>

                  </div>

                  {/* Description */}

                  <p className="admin-description">
                    {ticket.description}
                  </p>

                  {/* Information */}

                  <div className="admin-ticket-info">

                    <div>
                      <span>
                        Status
                      </span>

                      <strong>
                        {ticket.status}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Created By
                      </span>

                      <strong>
                        {ticket.createdBy?.name ||
                          "Unknown"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Assigned To
                      </span>

                      <strong>
                        {ticket.assignedTo?.name ||
                          "Not assigned"}
                      </strong>
                    </div>

                  </div>

                  {/* Assignment */}

                  <div className="assignment-section">

                    <label>
                      Assign Technician
                    </label>

                    <select
                      defaultValue=""
                      onChange={(e) =>
                        assignTicket(
                          ticket._id,
                          e.target.value
                        )
                      }
                    >

                      <option
                        value=""
                        disabled
                      >
                        Select Technician
                      </option>

                      {technicians.map(
                        (technician) => (

                          <option
                            key={
                              technician._id
                            }
                            value={
                              technician._id
                            }
                          >
                            {technician.name}
                          </option>

                        )
                      )}

                    </select>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;