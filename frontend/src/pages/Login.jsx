import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
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
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Brand */}

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
          <h2>Welcome back 👋</h2>

          <p>
            Sign in to manage your support workspace
          </p>
        </div>

        {/* Form */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                ✉
              </span>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                autoComplete="email"
              />

            </div>

          </div>

          {/* Password */}

          <div className="form-group">

            <div className="password-label">

              <label htmlFor="password">
                Password
              </label>

            </div>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="login-error">
              <span>⚠</span>

              <p>{error}</p>
            </div>
          )}

          {/* Login */}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        {/* Register */}

        <div className="register-section">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </button>

        </div>

        {/* Security */}

        <div className="login-security">
          🔒 Secure access to your ServiceDesk workspace
        </div>

      </div>

    </div>
  );
}

export default Login;