import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/CreateTicket.css";

function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/tickets", {
        title,
        description,
        priority,
        category,
      });

      setMessage(
        response.data.message || "Ticket created successfully!"
      );

      setTimeout(() => {
        navigate("/employee");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to create ticket"
      );
    }
  };

  return (
  <div className="create-ticke
  t-page">

    <div className="create-ticket-header">
      <h1>Create Support Ticket</h1>

      <p>
        Tell us what you need help with and our support team will assist you.
      </p>
    </div>

    <div className="create-ticket-card">

      <form
        className="create-ticket-form"
        onSubmit={handleSubmit}
      >

        <div className="ticket-form-group">
          <label>Ticket Title</label>

          <input
            type="text"
            placeholder="e.g. Unable to access my account"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>


        <div className="ticket-form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
    
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Account">Access</option>
            <option value="Other">Other</option>
          </select>
        </div>


        <div className="ticket-form-group">
          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>


        <div className="ticket-form-group">
          <label>Description</label>

          <textarea
            placeholder="Describe your issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>


        <div className="ticket-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/employee")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-ticket-button"
          >
            Create Ticket
          </button>

        </div>

      </form>

    </div>

  </div>
);

}

export default CreateTicket;
