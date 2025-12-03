import React from "react";
import Link from "next/link";
import "@/styles/landing.css";

const Landing: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-content">
        <h1>Selamat Datang di KeuanganKu</h1>
        <p>Kelola pemasukan dan pengeluaranmu dengan mudah.</p>
        <div className="landing-actions">
          <Link href="/register"><a className="btn">Register</a></Link>
          <Link href="/login"><a className="btn btn-outline">Login</a></Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;