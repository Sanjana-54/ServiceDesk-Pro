import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/MyTickets.css";

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await api.get("/tickets/my");

      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status resolved";

      case "In Progress":
        return "status progress";

      case "Closed":
        return "status closed";

      default:
        return "status open";
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "priority high";

      case "Low":
        return "priority low";

      default:
        return "priority medium";
    }
  };

  return (
    <div className="tickets-page">

      {/* HEADER */}

      <div className="tickets-header">

        <div>
          <h1>My Tickets</h1>

          <p>
            Track and manage all your support requests
          </p>
        </div>

        <button
          className="create-ticket-btn"
          onClick={() => navigate("/create-ticket")}
        >
          <span>+</span>
          Create Ticket
        </button>

      </div>

      {/* SUMMARY */}

      <div className="tickets-summary">

        <div className="summary-card">
          <span>Total Tickets</span>
          <strong>{tickets.length}</strong>
        </div>

        <div className="summary-card">
          <span>Open</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "Open"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>In Progress</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "In Progress"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Resolved</span>
          <strong>
            {
              tickets.filter(
                (ticket) =>
                  ticket.status === "Resolved"
              ).length
            }
          </strong>
        </div>

      </div>

      {/* TICKETS */}

      <div className="tickets-section">

        <div className="section-heading">

          <div>
            <h2>Support Requests</h2>
            <p>
              View the current status of your tickets
            </p>
          </div>

          <button
            className="refresh-btn"
            onClick={fetchTickets}
          >
            ↻ Refresh
          </button>

        </div>

        {loading ? (
          <div className="tickets-empty">
            <div className="loading-spinner"></div>
            <h3>Loading tickets...</h3>
          </div>
        ) : tickets.length === 0 ? (

          <div className="tickets-empty">

            <div className="empty-icon">
              🎫
            </div>

            <h3>No tickets yet</h3>

            <p>
              You haven't created any support requests.
            </p>

            <button
              onClick={() =>
                navigate("/create-ticket")
              }
            >
              Create Your First Ticket
            </button>

          </div>

        ) : (

          <div className="ticket-list">

            {tickets.map((ticket) => (

              <div
                className="ticket-card"
                key={ticket._id}
              >

                <div className="ticket-main">

                  <div className="ticket-icon">
                    🎫
                  </div>

                  <div className="ticket-info">

                    <h3>
                      {ticket.title}
                    </h3>

                    <p>
                      {ticket.description}
                    </p>

                    <div className="ticket-meta">

                      <span>
                        #{ticket._id?.slice(-6)}
                      </span>

                      <span>
                        {ticket.category}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="ticket-right">

                  <span
                    className={getPriorityClass(
                      ticket.priority
                    )}
                  >
                    {ticket.priority}
                  </span>

                  <span
                    className={getStatusClass(
                      ticket.status
                    )}
                  >
                    {ticket.status}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyTickets;