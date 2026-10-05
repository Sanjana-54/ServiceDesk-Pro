import React, { useEffect, useState } from "react";
import api from "../services/api";

const ITManagerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ticketsRes, techniciansRes] = await Promise.all([
        api.get("/tickets"),
        api.get("/users/technicians"),
      ]);

      setTickets(ticketsRes.data.tickets || []);
      setTechnicians(techniciansRes.data.technicians || []);
    } catch (error) {
      console.error("IT Manager data error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load IT Manager data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateTicket = async (ticketId, field, value) => {
    try {
      const data = {};

      if (field === "assignedTo") {
        data.assignedTo = value === "" ? null : value;
      }

      if (field === "status") {
        data.status = value;
      }

      if (field === "priority") {
        data.priority = value;
      }

      if (field === "category") {
        data.category = value;
      }

      const response = await api.patch(
        `/tickets/${ticketId}`,
        data
      );

      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket._id === ticketId
            ? response.data.ticket
            : ticket
        )
      );
    } catch (error) {
      console.error("Update ticket error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update ticket"
      );
    }
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") return "resolved";
    if (status === "In Progress") return "progress";
    if (status === "Closed") return "closed";
    return "open";
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>Loading IT Manager Dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.label}>IT MANAGEMENT</p>
          <h1>IT Manager Dashboard</h1>
          <p style={styles.subtitle}>
            Manage service tickets and technician assignments.
          </p>
        </div>

        <button
          style={styles.refreshButton}
          onClick={fetchData}
        >
          Refresh
        </button>
      </div>

      <div style={styles.stats}>
        <div style={styles.card}>
          <span>Total Tickets</span>
          <strong>{tickets.length}</strong>
        </div>

        <div style={styles.card}>
          <span>Open</span>
          <strong>
            {
              tickets.filter(
                (ticket) => ticket.status === "Open"
              ).length
            }
          </strong>
        </div>

        <div style={styles.card}>
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

        <div style={styles.card}>
          <span>Resolved</span>
          <strong>
            {
              tickets.filter(
                (ticket) => ticket.status === "Resolved"
              ).length
            }
          </strong>
        </div>
      </div>

      <div style={styles.section}>
        <h2>All Service Tickets</h2>

        {tickets.length === 0 ? (
          <p>No tickets available.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Technician</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td>
                      {ticket.createdBy?.name || "Unknown"}
                    </td>

                    <td>
                      <strong>{ticket.title}</strong>
                    </td>

                    <td>{ticket.category}</td>

                    <td>
                      <select
                        value={ticket.priority}
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            "priority",
                            e.target.value
                          )
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">
                          Medium
                        </option>
                        <option value="High">High</option>
                        <option value="Critical">
                          Critical
                        </option>
                      </select>
                    </td>

                    <td>
                      <select
                        value={
                          ticket.assignedTo?._id || ""
                        }
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            "assignedTo",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Unassigned
                        </option>

                        {technicians.map((technician) => (
                          <option
                            key={technician._id}
                            value={technician._id}
                          >
                            {technician.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        className={getStatusClass(
                          ticket.status
                        )}
                        value={ticket.status}
                        onChange={(e) =>
                          updateTicket(
                            ticket._id,
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">
                          In Progress
                        </option>
                        <option value="Resolved">
                          Resolved
                        </option>
                        <option value="Closed">
                          Closed
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f6f7fb",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  label: {
    color: "#4338ca",
    fontWeight: "bold",
    marginBottom: "5px",
  },

  headerTitle: {
    margin: 0,
  },

  subtitle: {
    color: "#6b7280",
  },

  refreshButton: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  section: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default ITManagerDashboard;