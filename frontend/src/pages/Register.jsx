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
  input,
  passwordToggle,
  errorBox,
  primaryButton,
  dividerSection,
  ghostButton,
  securityText,
  spinner,
} from "../styles/common";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      alert("Account created successfully.");

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account."
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
            Create your account
          </h2>

          <p className={`mt-2 ${bodyText}`}>
            Register to access your support workspace
          </p>
        </div>

        {/* Register Form */}
        <form
          className={form}
          onSubmit={handleRegister}
        >

          {/* Name */}
          <div className={formGroup}>
            <label
              htmlFor="name"
              className={label}
            >
              Full Name
            </label>

            <div className={inputWrapper}>
              <span className={inputIcon}>
                •
              </span>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={inputWithIcon}
                required
                autoComplete="name"
              />
            </div>
          </div>

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
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputWithIcon} pr-[70px]`}
                required
                minLength={6}
                autoComplete="new-password"
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

          {/* Role */}
          <div className={formGroup}>
            <label
              htmlFor="role"
              className={label}
            >
              Account Type
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={input}
            >
              <option value="Employee">
                Employee
              </option>

              <option value="Technician">
                Technician
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className={errorBox}>
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className={primaryButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={spinner}></span>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        {/* Login */}
        <div className={dividerSection}>
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            className={ghostButton}
            onClick={() => navigate("/")}
          >
            Sign in
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

export default Register;