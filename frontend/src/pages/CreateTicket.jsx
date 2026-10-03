import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  pageBackground,
  contentWrapper,
  card,
  pageTitle,
  bodyText,
  form,
  formGroup,
  label,
  input,
  primaryButton,
  secondaryButton,
  errorBox,
} from "../styles/common";

function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Other");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/tickets", {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
      });

      setMessage(
        response.data.message ||
          "Ticket created successfully!"
      );

      setTimeout(() => {
        navigate("/employee");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to create ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${pageBackground} min-h-screen px-4 py-8 sm:px-6 lg:px-8`}
    >
      <div className={contentWrapper}>

        {/* Header */}

        <div className="mb-8">
          <h1 className={pageTitle}>
            Create Support Ticket
          </h1>

          <p className={`mt-2 ${bodyText}`}>
            Tell us what you need help with and our
            support team will assist you.
          </p>
        </div>

        {/* Form Card */}

        <div className={`${card} mx-auto w-full max-w-3xl p-6 sm:p-8`}>

          <form
            className={form}
            onSubmit={handleSubmit}
          >

            {/* Title */}

            <div className={formGroup}>
              <label
                htmlFor="title"
                className={label}
              >
                Ticket Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="e.g. Unable to access my account"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setMessage("");
                }}
                className={input}
                required
              />
            </div>

            {/* Category */}

            <div className={formGroup}>
              <label
                htmlFor="category"
                className={label}
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className={input}
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
            </div>

            {/* Priority */}

            <div className={formGroup}>
              <label
                htmlFor="priority"
                className={label}
              >
                Priority
              </label>

              <select
                id="priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className={input}
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
            </div>

            {/* Description */}

            <div className={formGroup}>
              <label
                htmlFor="description"
                className={label}
              >
                Description
              </label>

              <textarea
                id="description"
                placeholder="Describe your issue in detail..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setMessage("");
                }}
                className={`${input} min-h-36 resize-y py-3`}
                required
              />
            </div>

            {/* Message */}

            {message && (
              <div
                className={
                  message.includes("successfully")
                    ? "rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700"
                    : errorBox
                }
              >
                <span>{message}</span>
              </div>
            )}

            {/* Actions */}

            <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                className={secondaryButton}
                onClick={() =>
                  navigate("/employee")
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Ticket"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default CreateTicket;