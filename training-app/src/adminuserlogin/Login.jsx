import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const [user_ln, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_ln }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.user_role);
        localStorage.setItem("user_ln", data.user_ln);

        // redirect based on role
        if (data.user_role === "admin") {
           alert("admin");
          window.location.href = "/admin";
        } else if (data.user_role === 'lead')
        {
            alert("member");
            window.location.href = "/lead"
        }
        else {
          window.location.href = "/member";
        }
      } else {
        setMessage(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setMessage("Server error. Please try again.");
    }
  };

  //password = "";
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <p className="subtitle">Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label className="input-label">
            Username
            <input
              type="text"
              value={user_ln}
              onChange={(e) => setEmail(e.target.value)}
              required
              //placeholder="you@example.com"
              className="input-field"
            />
          </label>

          {/* <label className="input-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              //placeholder="Your password"
              className="input-field"
            />
          </label> */}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>

          {message && <div className="error">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
