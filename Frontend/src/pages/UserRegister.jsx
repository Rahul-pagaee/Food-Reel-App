import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegisterHandler } from "../hooks/useAuth";
import "../styles/auth.css";

function UserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userRegisterHandler(formData);
      navigate("/user/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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

          <div className="auth-eyebrow">User Register</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join today and enjoy a smooth food video discovery experience.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <label className="input-group">
            <span>Full name</span>
            <input
              value={formData.fullName}
              onChange={handleChange}
              className="auth-input"
              type="text"
              name="fullName"
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </label>

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
              placeholder="Create a secure password"
              autoComplete="new-password"
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already a member? <Link to="/user/login">Login</Link>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <Link to="/partner/register">Register as Food Partner ➔</Link>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
