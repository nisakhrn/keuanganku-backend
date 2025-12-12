"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      // Login berhasil
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      toast.success("Login berhasil!");

      // Redirect langsung ke dashboard
      router.push("/dashboard");
    } catch (err) {
      toast.error("Terjadi kesalahan saat login");
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <Toaster position="top-center" />

      <Link href="/" className="back-btn">←</Link>

      <div className="login-left">
        <h1 className="welcome-title">Welcome!</h1>
        <p className="welcome-desc">Login untuk melanjutkan ke aplikasi pencatatan keuanganmu.</p>
      </div>

      <div className="login-card">
        <h1 className="login-title">Sign In</h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Belum punya akun? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
