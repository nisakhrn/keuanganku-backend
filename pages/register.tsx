"use client";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: "Password tidak sama" });
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ general: data.message });
      return;
    }

    setSuccess("Registrasi berhasil! Silakan login.");
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });
  };

  return (
    <div className="login-layout">

      {/* 🔙 BACK ARROW */}
      <Link href="/" className="back-btn">
        ←
      </Link>

      {/* LEFT SIDE */}
      <div className="login-left">
        <h1 className="welcome-title">Create Account</h1>
        <p className="welcome-desc">
          Buat akun baru untuk mulai mengelola catatan keuanganmu secara lebih mudah.
        </p>
      </div>

      {/* RIGHT SIDE (REGISTER CARD) */}
      <div className="login-card">
        <h1 className="login-title">Register</h1>

        {success && <p className="success-message">{success}</p>}
        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              className="input-field"
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && (
              <p className="error-message">{errors.password_confirmation}</p>
            )}
          </div>

          <button className="login-btn">Register</button>

          <p className="register-text">
            Sudah punya akun? <a href="/login">Login</a>
          </p>
        </form>
      </div>

    </div>
  );
}
