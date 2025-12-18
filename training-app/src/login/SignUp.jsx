import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../component/alert"; 
import "../view/login.css";
import logo from "../resources/infor.png";

const Signup = () => {
  const [user_fn, setFirstName] = useState("");
  const [user_ln, setLastName] = useState("");
  const [user_email, setEmail] = useState("");

  const user_role = "member"; // Auto assign

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = {
      user_fn,
      user_ln,
      user_email,
      user_role
    };

    try {
      const res = await fetch("http://localhost:8081/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Create failed");

      showAlert("Member created successfully! Please log in.", "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showAlert("Signup failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="subtitle">Training Management Tool</h2>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <label className="input-label">
            <input
              type="text"
              placeholder="First Name"
              value={user_fn}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="input-field"
            />
          </label>

          <label className="input-label">
            <input
              type="text"
              placeholder="Last Name"
              value={user_ln}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="input-field"
            />
          </label>

          <label className="input-label">
            <input
              type="email"
              placeholder="Email"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            Sign Up
          </button>
          
          {message && <div className="error">{message}</div>}
          <div className="signup-link">
            <h4>Already have an account?</h4>
            <button 
              type="button" 
              className="btn secondary-btn"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
