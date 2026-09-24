import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { getUser, logout } from "../services/auth";

import "./EmployeeDashboard.css";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Medium");

  const fetchTickets = async () => {
    try {
      const response = await api.get("/tickets/my-tickets");
      setTickets(response.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tickets", {
        title,
        description,
        category,
        priority,
      });

      setTitle("");
      setDescription("");
      setCategory("Other");
      setPriority("Medium");

      alert("Ticket created successfully");

      fetchTickets();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Ticket creation failed"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="employee-layout">

      {/* SIDEBAR */}
      <aside className="employee-sidebar">

        <div className="employee-logo">
          <div className="employee-logo-icon">S</div>

          <div>
            <h2>ServiceDesk</h2>
            <span>PRO</span>
          </div>
        </div>

        <nav className="employee-nav">

          <div className="employee-nav-item active">
            <span>▣</span>
            Dashboard
          </div>

          <div className="employee-nav-item">
            <span>🎫</span>
            My Tickets
          </div>

          <div className="employee-nav-item">
            <span>＋</span>
            Create Ticket
          </div>

        </nav>

        <div className="employee-sidebar-bottom">

          <div className="employee-profile">

            <div className="employee-avatar">
              {user?.name?.charAt(0) || "E"}
            </div>

            <div>
              <strong>{user?.name || "Employee"}</strong>
              <small>Employee</small>
            </div>

          </div>

          <button
            className="employee-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="employee-main">

        {/* HEADER */}
        <header className="employee-header">

          <div>
            <h1>Employee Dashboard</h1>

            <p>
              Welcome back, {user?.name || "Employee"} 👋
            </p>
          </div>

          <div className="employee-header-right">

            <button className="employee-notification">
              🔔
            </button>

            <div className="employee-header-avatar">
              {user?.name?.charAt(0) || "E"}
            </div>

          </div>

        </header>

        {/* QUICK STATS */}
        <section className="employee-stats">

          <div className="employee-stat-card">

            <div className="employee-stat-icon purple">
              🎫
            </div>

            <div>
              <p>Total Tickets</p>
              <h2>{tickets.length}</h2>
            </div>

          </div>

          <div className="employee-stat-card">

            <div className="employee-stat-icon orange">
              ⚡
            </div>

            <div>
              <p>Open Tickets</p>

              <h2>
                {
                  tickets.filter(
                    (ticket) =>
                      ticket.status === "Open"
                  ).length
                }
              </h2>
            </div>

          </div>

          <div className="employee-stat-card">

            <div className="employee-stat-icon green">
              ✓
            </div>

            <div>
              <p>Resolved</p>

              <h2>
                {
                  tickets.filter(
                    (ticket) =>
                      ticket.status === "Resolved"
                  ).length
                }
              </h2>
            </div>

          </div>

        </section>

        {/* CREATE TICKET */}
        <section className="create-ticket-card">

          <div className="employee-section-title">

            <div>
              <h2>Create a Support Ticket</h2>

              <p>
                Describe your issue and our IT team
                will help you.
              </p>
            </div>

            <div className="ticket-icon">
              +
            </div>

          </div>

          <form
            className="ticket-form"
            onSubmit={createTicket}
          >

            <div className="form-group">

              <label>Ticket Title</label>

              <input
                placeholder="Example: Laptop is not connecting to Wi-Fi"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>Description</label>

              <textarea
                placeholder="Explain your problem in detail..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Category</label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                >
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Network</option>
                  <option>Access</option>
                  <option>Other</option>
                </select>

              </div>

              <div className="form-group">

                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>

              </div>

            </div>

            <button
              className="create-ticket-btn"
              type="submit"
            >
              Create Ticket
            </button>

          </form>

        </section>

        {/* MY TICKETS */}
        <section className="my-tickets-card">

          <div className="employee-section-title">

            <div>
              <h2>My Tickets</h2>

              <p>
                Track the support requests you have
                submitted.
              </p>
            </div>

            <button
              className="refresh-tickets"
              onClick={fetchTickets}
            >
              ↻ Refresh
            </button>

          </div>

          {tickets.length === 0 ? (

            <div className="employee-empty">

              <div>🎫</div>

              <h3>No tickets yet</h3>

              <p>
                Create your first support ticket
                using the form above.
              </p>

            </div>

          ) : (

            <div className="employee-ticket-list">

              {tickets.map((ticket) => (

                <div
                  className="employee-ticket"
                  key={ticket._id}
                >

                  <div className="ticket-main">

                    <div className="ticket-title-row">

                      <h3>{ticket.title}</h3>

                      <span
                        className={`employee-status ${ticket.status
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {ticket.status}
                      </span>

                    </div>

                    <p className="ticket-description">
                      {ticket.description}
                    </p>

                    <div className="ticket-meta">

                      <span>
                        Category:{" "}
                        <strong>{ticket.category}</strong>
                      </span>

                      <span>
                        Priority:{" "}
                        <strong>{ticket.priority}</strong>
                      </span>

                    </div>

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