import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (user.role === "System Admin") {
        navigate("/admin");
      } else if (user.role === "IT Manager") {
        navigate("/admin");
      } else if (user.role === "Technician") {
        navigate("/technician");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo / Brand */}

        <div className="login-brand">
          <div className="brand-icon">
            SD
          </div>

          <div>
            <h1>ServiceDesk Pro</h1>
            <p>IT Service Management</p>
          </div>
        </div>

        {/* Heading */}

        <div className="login-heading">
          <h2>Welcome back</h2>

          <p>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
          >
            Sign In
          </button>

        </form>

        {/* Register */}

        <div className="register-section">

          <span>
            Don't have an account?
          </span>

          <button
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;