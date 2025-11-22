// src/components/Sidebar.tsx
import Link from 'next/link';  // Menggunakan Link dari next/link
import { useRouter } from 'next/router';  // Menggunakan useRouter untuk mengetahui route aktif
import '../styles/sidebar.css'; // Pastikan file CSS ini ada

const Sidebar = () => {
  const router = useRouter();  // Hook untuk mengetahui path aktif

  // Menu items untuk sidebar
  const menuItems = [
    { path: "/dashboard", icon: "fas fa-home", label: "Dashboard" },
    { path: "/transaksi", icon: "fas fa-exchange-alt", label: "Transaksi" },
    { path: "/riwayat", icon: "fas fa-history", label: "Riwayat Transaksi" },
    { path: "/profile", icon: "fas fa-user-circle", label: "Profil" },
  ];

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");  // Navigasi ke halaman login setelah logout
  };

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
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a
                  className={`sidebar-link ${router.pathname === item.path ? "active" : ""}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-logout">
        <button onClick={handleLogout} className="sidebar-link logout-button">
          <i className="fas fa-sign-out-alt"></i>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;