// src/pages/index.tsx
import Link from 'next/link';

const Landing = () => {
  return (
    <div className="app">
      <nav className="navbar">
        {/* Navbar */}
      </nav>
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Kelola Keuangan Anda dengan <span>Mudah & Cerdas</span></h1>
            <p>Catat pemasukan dan pengeluaran, pantau grafik keuangan, dan wujudkan tujuan finansial Anda dengan KeuanganKu.</p>
            <div className="hero-buttons">
              <Link href="/register">
                Mulai Sekarang →  {/* Hanya teks, tanpa <a> */}
              </Link>
              <button className="btn-secondary">Lihat Demo</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;