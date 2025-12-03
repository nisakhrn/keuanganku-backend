import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/components/Sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Transaction {
  _id: string;
  jenis: "pemasukan" | "pengeluaran";
  deskripsi: string;
  kategori: string;
  tanggal: string;
  jumlah: number;
}

export default function Dashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartMode, setChartMode] = useState<"daily" | "monthly">("daily");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
  });

  /* =========================
     TAMBAHAN: MODAL LOGOUT
  ========================= */
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  /* ============================================================
     1. LOAD USER (once)
  ============================================================ */
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");

    if (!userData) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } catch (err) {
      localStorage.removeItem("currentUser");
      router.push("/login");
    }
  }, []);

  /* ============================================================
     2. FETCH TRANSACTIONS
  ============================================================ */
  const fetchTransactions = useCallback(
    async (signal?: AbortSignal) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const email = encodeURIComponent(currentUser.email);
        const res = await fetch(`/api/transaksi/get?email=${email}`, { signal });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Fetch error: ${res.status} ${txt}`);
        }
        const txData = await res.json();
        const data = Array.isArray(txData.transactions) ? txData.transactions : [];
        setTransactions(data);
        calculateStats(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("Error loading transactions:", err);
        setError("Gagal memuat transaksi. Silakan coba refresh halaman.");
        setTransactions([]);
        setStats({ totalBalance: 0, monthlyIncome: 0, monthlyExpense: 0 });
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    if (!currentUser) return;

    const controller = new AbortController();
    fetchTransactions(controller.signal);

    return () => controller.abort();
  }, [currentUser, fetchTransactions]);

  /* ============================================================
     3. HITUNG STATISTIK
  ============================================================ */
  const calculateStats = (txs: Transaction[]) => {
    const now = new Date();
    let income = 0;
    let expense = 0;

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      if (!tx || !tx.tanggal) continue;
      const d = new Date(tx.tanggal);
      if (isNaN(d.getTime())) continue;

      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        if (tx.jenis === "pemasukan") income += Number(tx.jumlah) || 0;
        else expense += Number(tx.jumlah) || 0;
      }
    }

    setStats({
      totalBalance: income - expense,
      monthlyIncome: income,
      monthlyExpense: expense,
    });
  };

  /* ============================================================
     4. FORMAT RUPIAH
  ============================================================ */
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  /* ============================================================
     5. GRAFIK 7 HARI
  ============================================================ */
  const dailyChartData = useMemo(() => {
    const today = new Date();
    const days: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    return days.map((dateStr) => {
      let pemasukan = 0;
      let pengeluaran = 0;

      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        if (!tx || !tx.tanggal) continue;
        const txDate = tx.tanggal.split("T")[0];
        if (txDate === dateStr) {
          if (tx.jenis === "pemasukan") pemasukan += Number(tx.jumlah) || 0;
          else pengeluaran += Number(tx.jumlah) || 0;
        }
      }

      const label = new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });

      return {
        tanggal: label,
        pemasukan,
        pengeluaran,
      };
    });
  }, [transactions]);

  /* ============================================================
     6. GRAFIK 12 BULAN
  ============================================================ */
  const monthlyChartData = useMemo(() => {
    const months: string[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const map: Record<string, { pemasukan: number; pengeluaran: number }> = {};
    months.forEach((m) => (map[m] = { pemasukan: 0, pengeluaran: 0 }));

    transactions.forEach((tx) => {
      if (!tx || !tx.tanggal) return;
      const d = new Date(tx.tanggal);
      if (isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) return;

      if (tx.jenis === "pemasukan") map[key].pemasukan += Number(tx.jumlah) || 0;
      else map[key].pengeluaran += Number(tx.jumlah) || 0;
    });

    return months.map((k) => {
      const [y, m] = k.split("-");
      const date = new Date(Number(y), Number(m) - 1, 1);
      return {
        bulan: date.toLocaleDateString("id-ID", { month: "short" }),
        pemasukan: map[k].pemasukan,
        pengeluaran: map[k].pengeluaran,
      };
    });
  }, [transactions]);

  /* ============================================================
     7. HANDLE LOGOUT (DI MODAL)
  ============================================================ */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {}
    finally {
      localStorage.removeItem("currentUser");
      router.push("/login");
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */
  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>

          <div className="user-info">
            <i className="fas fa-bell notification-icon"></i>
            <span className="user-name-link">{currentUser.name}</span>

            {/* === UBAHAN: tombol logout buka modal === */}
            <button onClick={openLogoutModal} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* STATISTIK */}
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

          {/* ERROR/LOADING */}
          {loading ? (
            <div style={{ padding: 24 }}>Memuat data...</div>
          ) : error ? (
            <div style={{ padding: 24, color: "red" }}>{error}</div>
          ) : (
            <>
              {/* CHART MODE */}
              <div className="chart-toggle">
                <button
                  className={chartMode === "daily" ? "chart-btn active" : "chart-btn"}
                  onClick={() => setChartMode("daily")}
                >
                  7 Hari Terakhir
                </button>
                <button
                  className={chartMode === "monthly" ? "chart-btn active" : "chart-btn"}
                  onClick={() => setChartMode("monthly")}
                >
                  Per Bulan
                </button>
              </div>

              {/* CHART */}
              <div className="chart-card">
                <h3 className="chart-title">
                  Grafik {chartMode === "daily" ? "Harian (7 Hari)" : "Bulanan"}
                </h3>

                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartMode === "daily" ? dailyChartData : monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={chartMode === "daily" ? "tanggal" : "bulan"} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pemasukan" fill="#4CAF50" name="Pemasukan" />
                      <Bar dataKey="pengeluaran" fill="#F44336" name="Pengeluaran" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TRANSAKSI LIST */}
              <div className="transactions-card" style={{ marginTop: 24 }}>
                <div className="transactions-header">
                  <h3>Transaksi Terbaru</h3>
                  <span onClick={() => router.push("/transaksi")} className="view-all">
                    Tambah Transaksi
                  </span>
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
                          <button
                            className="add-btn"
                            onClick={() => router.push("/transaksi")}
                          >
                            + Tambah Transaksi
                          </button>
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((tx) => (
                        <tr key={tx._id}>
                          <td>{tx.deskripsi}</td>
                          <td>{tx.kategori}</td>
                          <td>{new Date(tx.tanggal).toLocaleDateString("id-ID")}</td>
                          <td
                            className={`text-right ${
                              tx.jenis === "pemasukan" ? "positive" : "negative"
                            }`}
                          >
                            {tx.jenis === "pemasukan" ? "+" : "-"}{" "}
                            {formatRupiah(tx.jumlah)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* POPUP MODAL (SAMA PERSIS DENGAN SIDEBAR) */}
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
    </div>
  );
}