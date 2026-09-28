import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { foodPartnerRegisterHandler } from "../hooks/useAuth";
import "../styles/auth.css";

function PartnerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
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
      await foodPartnerRegisterHandler(formData);
      navigate("/create-food");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-mark">P</span>
            <span>Food Partner</span>
          </Link>

          <div className="auth-eyebrow">Partner Register</div>
          <h1 className="auth-title">Grow with FoodView</h1>
          <p className="auth-subtitle">
            List your business and start reaching more hungry customers with
            video reels.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-form-row">
            <label className="input-group">
              <span>Restaurant name</span>
              <input
                className="auth-input"
                value={formData.name}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="e.g. Royal Biryani Hub"
                autoComplete="organization"
                required
              />
            </label>

            <label className="input-group">
              <span>Contact name</span>
              <input
                value={formData.contactName}
                onChange={handleChange}
                className="auth-input"
                type="text"
                name="contactName"
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </label>
          </div>

          <div className="auth-form-row">
            <label className="input-group">
              <span>Phone number</span>
              <input
                value={formData.phone}
                onChange={handleChange}
                className="auth-input"
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                autoComplete="tel"
                required
              />
            </label>

            <label className="input-group">
              <span> Email</span>
              <input
                value={formData.email}
                onChange={handleChange}
                className="auth-input"
                type="email"
                name="email"
                placeholder="partner@restaurant.com"
                autoComplete="email"
                required
              />
            </label>
          </div>

          <label className="input-group">
            <span>Restaurant address</span>
            <input
              value={formData.address}
              onChange={handleChange}
              className="auth-input"
              type="text"
              name="address"
              placeholder="Full shop / restaurant address"
              autoComplete="street-address"
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
            {loading ? "Registering restaurant..." : "Register Restaurant"}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/partner/login">Login here</Link>
        </div>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="auth-footer">
          <Link to="/user/register">Register as Normal User ➔</Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerRegister;
