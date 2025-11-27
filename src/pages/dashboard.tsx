import Sidebar from '../components/Sidebar';  // Mengimpor Sidebar
import { useState, useEffect } from 'react';  // Menggunakan hooks untuk state dan efek
import Link from 'next/link';  // Menggunakan Link dari Next.js untuk navigasi

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });
  const [transactions, setTransactions] = useState([]);  // Menggunakan state untuk menyimpan transaksi

  // Ambil data transaksi dan statistik
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const key = `transactions_${user?.email}`;
    const transactionsFromStorage = JSON.parse(localStorage.getItem(key) || '[]');
    setTransactions(transactionsFromStorage);  // Set data transaksi
    calculateStats(transactionsFromStorage);
  }, []);

  // Fungsi untuk menghitung saldo dan transaksi
  const calculateStats = (transactions: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.tanggal);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        if (tx.kategori === "pemasukan") {
          income += parseFloat(tx.jumlah);
        } else {
          expense += parseFloat(tx.jumlah);
        }
      }
    });

    setStats({
      totalBalance: income - expense,
      monthlyIncome: income,
      monthlyExpense: expense,
    });
  };

  // Format angka menjadi format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';  // Redirect ke login setelah logout
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />  {/* Sidebar di kiri */}
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="user-info">
            <span className="notification-icon">
              <i className="fas fa-bell"></i>
              <span className="notification-badge"></span>
            </span>

            <Link href="/profile">
              <a className="user-name-link">
                <span className="user-name">Nama Pengguna</span>
              </a>
            </Link>

            <button onClick={handleLogout} className="logout-btn" title="Keluar">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Saldo Total</span>
                <div className="stat-icon purple">
                  <i className="fas fa-wallet"></i>
                </div>
              </div>
              <div className="stat-value">{formatRupiah(stats.totalBalance)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Pemasukan Bulan Ini</span>
                <div className="stat-icon green">
                  <i className="fas fa-arrow-down"></i>
                </div>
              </div>
              <div className="stat-value">{formatRupiah(stats.monthlyIncome)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Pengeluaran Bulan Ini</span>
                <div className="stat-icon red">
                  <i className="fas fa-arrow-up"></i>
                </div>
              </div>
              <div className="stat-value">{formatRupiah(stats.monthlyExpense)}</div>
            </div>
          </div>

          {/* Transaksi Terbaru */}
          <div className="transactions-card">
            <div className="transactions-header">
              <h3>Transaksi Terbaru</h3>
              <Link href="/transaksi">
                <a className="view-all">Tambah Transaksi</a>
              </Link>
            </div>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>DESKRIPSI</th>
                  <th>KATEGORI</th>
                  <th>TANGGAL</th>
                  <th className="text-right">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      <i className="fas fa-exchange-alt"></i>
                      <p>Belum ada transaksi</p>
                      <Link href="/transaksi">
                        <a className="add-btn">+ Tambah Transaksi</a>
                      </Link>
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 5).map((tx: any, idx: number) => (
                    <tr key={idx}>
                      <td>{tx.deskripsi}</td>
                      <td>{tx.kategori}</td>
                      <td>{new Date(tx.tanggal).toLocaleDateString("id-ID")}</td>
                      <td className={`text-right ${tx.kategori === "pemasukan" ? "positive" : "negative"}`}>
                        {tx.kategori === "pemasukan" ? "+" : "-"} {formatRupiah(parseFloat(tx.jumlah))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;