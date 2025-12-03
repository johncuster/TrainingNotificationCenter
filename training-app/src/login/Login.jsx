import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

import "./login.css";
import logo from "../resources/infor.png";

const Login = () => {
  const [user_ln, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (user.user_role === "admin") navigate("/trainings");
    else if (user.user_role === "lead") navigate("/leadDashboard");
    else if (user.user_role === "member") navigate("/memberDashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_ln, user_password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        login(data);

        if (data.user_role === "admin") window.location.href = "/trainings";
        else if (data.user_role === "lead") window.location.href = "/leadDashboard";
        else if (data.user_role === "member") window.location.href = "/memberDashboard";
        else alert("User role not recognized.");
      } else {
        setMessage(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <img src={logo} alt="Logo" className="logo" />
       
          <h2 className="subtitle">Training Management Tool</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label className="input-label">
            <input
              type="text"
              placeholder="Email"
              value={user_ln}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </label>

          <label className="input-label">
            <input
              type="password"
              placeholder="Password"
              value={user_password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </label>

          <button className="btn" type="submit" disabled={loading}>
            Sign In
          </button>

          {message && <div className="error">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
