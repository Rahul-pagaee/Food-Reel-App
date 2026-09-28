import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { foodPartnerLoginHandler } from "../hooks/useAuth";
import "../styles/auth.css";

function PartnerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await foodPartnerLoginHandler(formData);
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid Food Partner email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">P</span>
            <span>Food Partner</span>
          </Link>

          <div className="auth-eyebrow">Partner Login</div>
          <h1 className="auth-title">Manage your kitchen</h1>
          <p className="auth-subtitle">
            Access your storefront, food videos, and customer insights in one
            place.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="input-group">
            <span>Email</span>
            <input
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="partner@restaurant.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="auth-meta">
            <label className="auth-checkbox">
              <input type="checkbox" />
              Keep me signed in
            </label>
            <Link to="/partner/register" className="auth-link">
              Need help?
            </Link>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          New partner? <Link to="/partner/register">Register now</Link>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <Link to="/user/login">Login as Normal User ➔</Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerLogin;
