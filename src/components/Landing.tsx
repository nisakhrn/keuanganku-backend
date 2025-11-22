// src/components/Landing.tsx
import Link from 'next/link';

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>KeuanganKu</h1>
      <p>Catat Pemasukan & Pengeluaran Anda dengan Mudah.</p>
      <Link href="/login">
        <a className="btn-login">Login</a>
      </Link>
      <Link href="/register">
        <a className="btn-register">Register</a>
      </Link>
    </div>
  );
};

export default Landing;