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
    <div className="register-wrapper">
      <Link href="/" className="back-arrow">←</Link>

      <div className="register-card">
        <h2 className="register-title">Register</h2>

        {success && <p className="register-success">{success}</p>}
        {errors.general && <p className="register-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder=" "
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="form-label">Name</label>
          </div>

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
            {errors.email && <p className="register-error">{errors.email}</p>}
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

          <div className="form-group">
            <input
              type="password"
              name="password_confirmation"
              placeholder=" "
              className="form-input"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
            <label className="form-label">Confirm Password</label>
            {errors.password_confirmation && (
              <p className="register-error">{errors.password_confirmation}</p>
            )}
          </div>

          <button type="submit" className="btn-register">Register</button>

          <p className="register-login">
            Sudah punya akun?{" "}
            <Link href="/login" className="login-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}