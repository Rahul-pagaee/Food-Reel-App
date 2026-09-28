import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLoginHandler } from "../hooks/useAuth";
import "../styles/auth.css";

function UserLogin() {
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
      await userLoginHandler(formData);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">F</span>
            <span>FoodView</span>
          </Link>

          <div className="auth-eyebrow">User Login</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to discover tasty meals and your saved favorites.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="input-group">
            <span>Email</span>
            <input
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              type="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
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
              Remember me
            </label>
            <Link to="/user/register" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          New here? <Link to="/user/register">Create account</Link>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <Link to="/partner/login">Login as Food Partner ➔</Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
