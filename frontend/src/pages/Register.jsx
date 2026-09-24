import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Employee");

  const [message, setMessage] =
    useState("");

  const handleRegister =
    async (e) => {
      e.preventDefault();

      try {
        const response =
          await api.post(
            "/auth/register",
            {
              name,
              email,
              password,
              role,
            }
          );

        setMessage(
          response.data.message
        );

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        setMessage(
          error.response?.data
            ?.message ||
            "Registration failed"
        );
      }
    };

  return (
    <div>
      <h1>
        ServiceDesk Pro
      </h1>

      <h2>
        Register
      </h2>

      <form
        onSubmit={handleRegister}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
        />

        <br />
        <br />

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
        >
          <option>
            Employee
          </option>

          <option>
            Technician
          </option>

          <option>
            IT Manager
          </option>

          <option>
            System Admin
          </option>
        </select>

        <br />
        <br />

        <button type="submit">
          Register
        </button>
      </form>

      {message && (
        <p>{message}</p>
      )}

      <button
        onClick={() =>
          navigate("/")
        }
      >
        Back to Login
      </button>
    </div>
  );
}

export default Register;