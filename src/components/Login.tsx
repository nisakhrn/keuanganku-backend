// src/components/Login.tsx
import { useState } from "react";
import { useAppContext } from "./AppContext";
import "./login.css";

const Login = () => {
  const { login } =
    useAppContext() || { login: () => ({ success: false, message: "Fallback" }) };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    setMessage(result.message);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-left">
          <h1 className="welcome-title">Welcome!</h1>
          <p className="welcome-desc">
            Akses panel dashboard kamu dan kelola seluruh data dengan mudah.
          </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="login-right glass">
          <h2 className="signin-title">Sign In</h2>

          <form className="signin-form" onSubmit={handleSubmit}>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn-submit" type="submit">
              Submit
            </button>
          </form>

          {message && <p className="response-msg">{message}</p>}

          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest"></i>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;