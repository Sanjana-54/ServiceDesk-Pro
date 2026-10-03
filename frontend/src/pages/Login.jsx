import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  pageBackground,
  formCard,
  brandContainer,
  brandIcon,
  brandTitle,
  brandSubtitle,
  heading,
  bodyText,
  form,
  formGroup,
  label,
  inputWrapper,
  inputWithIcon,
  inputIcon,
  passwordToggle,
  errorBox,
  primaryButton,
  dividerSection,
  ghostButton,
  securityText,
  spinner,
} from "../styles/common";

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
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to role
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
    <div
      className={`${pageBackground} flex min-h-screen items-center justify-center p-4 sm:p-8`}
    >
      <div className={formCard}>

        {/* Brand */}
        <div className={brandContainer}>
          <div className={brandIcon}>
            SD
          </div>

          <div>
            <h1 className={brandTitle}>
              ServiceDesk Pro
            </h1>

            <p className={brandSubtitle}>
              IT Service Management
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h2 className={heading}>
            Welcome back
          </h2>

          <p className={`mt-2 ${bodyText}`}>
            Sign in to manage your support workspace
          </p>
        </div>

        {/* Login Form */}
        <form
          className={form}
          onSubmit={handleLogin}
        >

          {/* Email */}
          <div className={formGroup}>
            <label
              htmlFor="email"
              className={label}
            >
              Email Address
            </label>

            <div className={inputWrapper}>
              <span className={inputIcon}>
                @
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
                className={inputWithIcon}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label
              htmlFor="password"
              className={label}
            >
              Password
            </label>

            <div className={inputWrapper}>
              <span className={inputIcon}>
                •
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
                className={`${inputWithIcon} pr-[70px]`}
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className={passwordToggle}
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className={errorBox}>
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            className={primaryButton}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={spinner}></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        {/* Register */}
        <div className={dividerSection}>
          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            className={ghostButton}
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>

        {/* Security */}
        <div className={securityText}>
          Secure access to your ServiceDesk workspace
        </div>

      </div>
    </div>
  );
}

export default Login;