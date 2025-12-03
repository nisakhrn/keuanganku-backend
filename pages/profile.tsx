import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/components/Sidebar";

interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string | null;
}

export default function Profile() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    avatar: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========== AMBIL USER DARI DATABASE BUKAN LOCALSTORAGE ==========
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!data.success || !data.user) {
          router.push("/login");
          return;
        }

        const user: User = data.user;
        setCurrentUser(user);

        const nameParts = user.name ? user.name.split(" ") : ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          firstName,
          lastName,
          phone: user.phone || "",
          email: user.email,
          avatar: user.avatar || null,
        });
      } catch (err) {
        router.push("/login");
      }
    }

    fetchUser();
  }, [router]);

  // ================= INPUT CHANGE ==================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= HANDLE AVATAR ==================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // ========== SIMPAN PERUBAHAN KE DATABASE ==========
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) return;

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      // 🔥 UPDATE KE DATABASE
      const res = await fetch(`/api/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone: formData.phone,
          avatar: formData.avatar,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Gagal memperbarui profil!");
        return;
      }

      // 🔥 UPDATE UI
      const updatedUser = {
        ...currentUser,
        name: fullName,
        phone: formData.phone,
        avatar: formData.avatar || undefined,
      };

      setCurrentUser(updatedUser);

      // 🔥 UPDATE localStorage juga
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      alert("Terjadi kesalahan server!");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Profil</h1>
        </header>

        <div className="profile-page-content">
          
          {/* ====================== NAV KIRI ====================== */}
          <div className="profile-nav-card">
            <div
              className="profile-summary"
              style={{ cursor: "pointer" }}
              onClick={handleAvatarClick}
            >
              <div className="summary-avatar">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" />
                ) : (
                  <i className="fas fa-camera"></i>
                )}
              </div>
              <h4>{currentUser.name}</h4>
              <p>{currentUser.email}</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />

            <nav className="profile-nav-menu">
              <ul>
                <li>
                  <a href="#informasi" className="active">
                    <i className="fas fa-user-circle"></i> Informasi Profil
                  </a>
                </li>
                <li>
                  <a href="#keamanan">
                    <i className="fas fa-shield-alt"></i> Keamanan
                  </a>
                </li>
                <li>
                  <a href="#notifikasi">
                    <i className="fas fa-bell"></i> Notifikasi
                  </a>
                </li>
                <li>
                  <a href="#preferensi">
                    <i className="fas fa-sliders-h"></i> Preferensi
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* ====================== KONTEN KANAN ====================== */}
          <div className="profile-main-content">
            <form onSubmit={handleSaveChanges} className="profile-info-card">
              <h3 className="card-title">Informasi Profil</h3>

              <div className="form-grid">
                <div className="form-group-profile">
                  <label htmlFor="firstName">Nama Depan</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-profile">
                  <label htmlFor="lastName">Nama Belakang</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-profile full-width">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="form-group-profile full-width">
                  <label htmlFor="phone">Nomor Telepon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions-profile">
                <button type="submit" className="btn-save-profile">
                  <i className="fas fa-save"></i> Simpan Perubahan
                </button>
              </div>
            </form>

            <div className="profile-preferences-card">
              <h3 className="card-title">Preferensi Keuangan</h3>

              <div className="preference-item">
                <div>
                  <label>Mata Uang Utama</label>
                  <p>Mata uang untuk menampilkan semua transaksi</p>
                </div>
                <select className="preference-select">
                  <option value="IDR">Rupiah (IDR)</option>
                  <option value="USD">Dollar (USD)</option>
                </select>
              </div>

              <div className="preference-item">
                <div>
                  <label>Format Tanggal</label>
                  <p>Format untuk menampilkan tanggal</p>
                </div>
                <select className="preference-select">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>

              <div className="preference-item">
                <div>
                  <label>Notifikasi Transaksi</label>
                  <p>Dapatkan notifikasi untuk setiap transaksi</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}