import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("Employee");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return "";

    if (password.length < 6) {
      return "Weak";
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (name.trim().length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      setMessage(
        response.data.message || "Registration successful!"
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">
          <div className="logo">SD</div>

          <h1>ServiceDesk Pro</h1>

          <p>Create your support account</p>
        </div>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {password && (
              <div
                className={`password-strength ${strength.toLowerCase()}`}
              >
                Password strength: <strong>{strength}</strong>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <div className="password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {confirmPassword &&
              password !== confirmPassword && (
                <small className="password-error">
                  Passwords do not match
                </small>
              )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Account Type</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Employee">
                Employee
              </option>

              <option value="Technician">
                Technician
              </option>

              <option value="IT Manager">
                IT Manager
              </option>
            </select>

            <small className="role-info">
              System Admin accounts should be created
              securely by an existing administrator.
            </small>
          </div>

          {/* Error */}
          {error && (
            <div className="message error">
              ❌ {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="message success">
              ✅ {message}
            </div>
          )}

          {/* Register */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="login-section">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;