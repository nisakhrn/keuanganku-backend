// src/components/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="fas fa-wallet"></i>
        </div>
        <span>KeuanganKu</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/dashboard">
              <a className="sidebar-link">Dashboard</a>
            </Link>
          </li>
          <li>
            <Link href="/transaksi">
              <a className="sidebar-link">Transaksi</a>
            </Link>
          </li>
          <li>
            <Link href="/riwayat">
              <a className="sidebar-link">Riwayat Transaksi</a>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <a className="sidebar-link">Profil</a>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-logout">
        <button onClick={() => alert('Logout')} className="sidebar-link logout-button">
          <i className="fas fa-sign-out-alt"></i>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;