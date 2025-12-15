// src/pages/index.tsx
import Link from 'next/link';

const Landing = () => {
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">

            {/* Logo Section */}
            <div className="logo-section">
              <div className="logo-icon">
                <i className="fas fa-folder" />
              </div>
              <span className="logo-text">KeuanganKu</span>
            </div>

            {/* Desktop Menu */}
            <div className="desktop-menu">
              <Link href="#features">
                <button className="nav-link">Fitur</button>
              </Link>

              <Link href="#benefits">
                <button className="nav-link">Keuntungan</button>
              </Link>

              <Link href="#team">
                <button className="nav-link">Tim Pengembang</button>
              </Link>

              {/* 🔥 TOMBOL MASUK */}
              <Link href="/login">
                <button className="btn-login">Masuk</button>
              </Link>

              <Link href="/register">
                <button className="btn-register">Daftar</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Kelola Keuangan Anda dengan <span>Mudah & Cerdas</span>
            </h1>

            <p>
              Catat pemasukan dan pengeluaran, pantau grafik keuangan, dan wujudkan tujuan finansial Anda dengan KeuanganKu.
            </p>

            <div className="hero-buttons">
              <Link href="/register">
                <button className="btn-primary">Mulai Sekarang →</button>
              </Link>

              <button className="btn-secondary">Lihat Demo</button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Pengguna Aktif</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">4.8/5</div>
                <div className="stat-label">Rating User</div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="card-wrapper">
              <div className="dashboard-card">

                <div className="card-header">
                  <h3 className="card-title">Saldo Total</h3>
                  <span className="card-icon">💰</span>
                </div>

                <div className="card-balance">Rp 5.250.000</div>
                <div className="card-trend">📈 +12% dari bulan lalu</div>

                <div className="card-stats">
                  <div className="stat-box stat-income">
                    <div className="stat-box-label">Pemasukan</div>
                    <div className="stat-box-value">Rp 8.500.000</div>
                  </div>

                  <div className="stat-box stat-expense">
                    <div className="stat-box-label">Pengeluaran</div>
                    <div className="stat-box-value">Rp 3.200.000</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">

          <div className="section-header">
            <h2 className="section-title">Fitur Unggulan</h2>
            <p className="section-subtitle">Semua yang Anda butuhkan untuk mengelola keuangan</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Dashboard Keuangan</h3>
              <p className="feature-desc">
                Kelola kondisi finansial Anda dengan mudah melalui tampilan ringkas yang menampilkan saldo, pemasukan, pengeluaran, dan grafik keuangan secara real-time
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Riwayat Transaksi</h3>
              <p className="feature-desc">
                Pantau semua transaksi Anda dengan riwayat lengkap dan detail yang terorganisir.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">

          <div className="section-header">
            <h2 className="section-title">Mengapa Memilih KeuanganKu?</h2>
            <p className="section-subtitle">Solusi terbaik untuk keuangan yang lebih sehat</p>
          </div>

          <div className="benefits-content">
            <div className="benefits-list">

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-green">📈</div>
                <div className="benefit-text">
                  <h3 className="benefit-title">Mudah Digunakan</h3>
                  <p className="benefit-desc">Interface yang intuitif dan user-friendly untuk semua kalangan.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-blue">📊</div>
                <div className="benefit-text">
                  <h3 className="benefit-title">Laporan Detail</h3>
                  <p className="benefit-desc">Dapatkan insight mendalam tentang pola keuangan Anda.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon benefit-icon-purple">🛡️</div>
                <div className="benefit-text">
                  <h3 className="benefit-title">100% Aman</h3>
                  <p className="benefit-desc">Privasi dan keamanan data Anda adalah prioritas utama kami.</p>
                </div>
              </div>

            </div>

            <div className="benefits-cta-card">
              <h3 className="cta-card-title">Mulai Gratis Hari Ini!</h3>
              <p className="cta-card-desc">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan mengelola keuangan dengan KeuanganKu.
              </p>

              <ul className="cta-list">
                <li className="cta-list-item">→ Tanpa biaya tersembunyi</li>
                <li className="cta-list-item">→ Tidak perlu kartu kredit</li>
                <li className="cta-list-item">→ Setup dalam 2 menit</li>
              </ul>

              <button className="cta-card-button">Daftar Sekarang</button>
            </div>

          </div>

        </div>
      </section>

      {/* Tim Pengembang Section */}
      <section id="team" className="team-section">
        <div className="section-container">

          <div className="section-header">
            <h2 className="section-title">Tim Pengembang</h2>
            <p className="section-subtitle">
              Berikut adalah tim pengembang yang bekerja keras untuk menciptakan aplikasi KeuanganKu
            </p>
          </div>

          <div className="team-grid">

            <div className="team-card">
              <div className="team-photo-wrap">
                <img
                  src="https://i.ibb.co.com/HLcfzbB4/dian1.jpg"
                  className="team-photo"
                  alt="Designer"
                />
              </div>
              <div className="team-name">Dian Nazira</div>
              <div className="team-npm">NPM: 2308107010011</div>
              <div className="team-role">Developer</div>
            </div>

            <div className="team-card">
              <div className="team-photo-wrap">
                <img
                  src="https://i.ibb.co.com/d0fWGVNM/nisa1.jpg"
                  className="team-photo"
                  alt="Developer"
                />
              </div>
              <div className="team-name">Khairun Nisa</div>
              <div className="team-npm">NPM: 2308107010074</div>
              <div className="team-role">Designer</div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-grid">

            <div className="footer-col">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <i className="fas fa-folder" />
                </div>
                <span className="footer-logo-text">KeuanganKu</span>
              </div>

              <p className="footer-desc">
                Solusi cerdas untuk mengelola keuangan pribadi Anda.
              </p>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Produk</h4>
              <ul className="footer-links">
                <li><a href="#">Fitur</a></li>
                <li><a href="#">Harga</a></li>
                <li><a href="#">Tutorial</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Perusahaan</h4>
              <ul className="footer-links">
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Karir</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Bantuan</h4>
              <ul className="footer-links">
                <li><a href="#">Pusat Bantuan</a></li>
                <li><a href="#">Kontak</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <p>© 2025 KeuanganKu. All rights reserved.</p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
