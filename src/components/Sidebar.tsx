import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems: MenuItem[] = [
    { path: "/dashboard", icon: "fas fa-home", label: "Dashboard" },
    { path: "/transaksi", icon: "fas fa-exchange-alt", label: "Transaksi" },
    { path: "/riwayat", icon: "fas fa-history", label: "Riwayat Transaksi" },
    { path: "/profile", icon: "fas fa-user-circle", label: "Profil" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const isActive = (path: string): boolean => {
    return router.pathname === path;
  };

  return (
    <>
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
                <Link
                  href={item.path}
                  className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="sidebar-link logout-button"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* POPUP MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Yakin mau keluar?</p>

            <div className="modal-actions">
              <button onClick={handleLogout} className="btn-yes">
                Ya
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn-no"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;