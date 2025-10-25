import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple auth - just check if fields are filled
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      onLogin();
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: "400px", margin: "100px auto" }}>
        <div className="card">
          <h1 className="text-center">Artemis</h1>
          <p className="text-center text-muted mb-2">
            Disease Tracker & Vaccination System
          </p>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@artemis.com"
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <button type="submit" style={{ width: "100%" }}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
