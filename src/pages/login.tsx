"use client";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.message });
      return;
    }

    // Simpan user JWT atau ID
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    setSuccess("Login berhasil!");
    setErrors({});

    window.location.href = "/dashboard";
  };

  return (
    <div className="login-wrapper">
      <Link href="/" className="back-arrow">⟵</Link>

      <div className="login-card">
        <h2 className="login-title">Login</h2>

        {success && <p className="login-success">{success}</p>}
        {errors.general && (
          <p className="login-error">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="form-label">Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder=" "
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className="form-label">Password</label>
          </div>

          <button type="submit" className="btn-login">Login</button>

          <p className="login-register">
            Belum punya akun?
            <Link href="/register" className="register-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}