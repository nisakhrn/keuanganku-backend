import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/components/Sidebar";

type FormState = {
  jenisTransaksi: "pemasukan" | "pengeluaran";
  deskripsi: string;
  kategori: string;
  jumlah: string;
  tanggal: string;
};

interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Transaction {
  _id: string;
  userEmail: string;
  jenis: "pemasukan" | "pengeluaran";
  deskripsi: string;
  kategori: string;
  jumlah: number;
  tanggal: string;
  createdAt?: string;
}

export default function TransaksiPage(): JSX.Element | null {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<FormState>({
    jenisTransaksi: "pemasukan",
    deskripsi: "",
    kategori: "",
    jumlah: "",
    tanggal: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("currentUser");
    if (!raw) {
      router.push("/login");
      return;
    }

    try {
      const parsed: User = JSON.parse(raw);
      setCurrentUser(parsed);
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchTransactions = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/transaksi/get?email=${encodeURIComponent(currentUser.email)}`
      );
      const data = await res.json();
      if (data && data.transactions) {
        // adapt possible different field names
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Fetch transactions error:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentUser) return;

    if (
      !formData.deskripsi ||
      !formData.kategori ||
      !formData.jumlah ||
      !formData.tanggal
    ) {
      alert("Mohon lengkapi semua field!");
      return;
    }

    try {
      const res = await fetch("/api/transaksi/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: currentUser.email,
          jenis: formData.jenisTransaksi,
          deskripsi: formData.deskripsi,
          kategori: formData.kategori,
          jumlah: Number(formData.jumlah),
          tanggal: formData.tanggal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchTransactions();
        setFormData({
          jenisTransaksi: "pemasukan",
          deskripsi: "",
          kategori: "",
          jumlah: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
        alert("Transaksi berhasil disimpan!");
      } else {
        alert(data.message || "Gagal menyimpan transaksi");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Terjadi kesalahan saat menyimpan transaksi.");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getCategoryOptions = () => {
    if (formData.jenisTransaksi === "pemasukan") {
      return ["Gaji", "Bonus", "Investasi", "Lainnya"];
    }
    return [
      "Makanan",
      "Transportasi",
      "Belanja",
      "Tagihan",
      "Hiburan",
      "Kesehatan",
      "Pendidikan",
      "Lainnya",
    ];
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Transaksi</h1>
        </header>

        <div className="dashboard-content">
          <div className="transaksi-container">
            {/* Form Card */}
            <div className="transaksi-form-card">
              <h3 className="transaksi-title">Tambah Transaksi Baru</h3>

              <form className="transaksi-form" onSubmit={handleSubmit}>
                <div className="form-full-width">
                  <div className="jenis-transaksi-group">
                    <label
                      htmlFor="jenis-pemasukan"
                      className={`jenis-label ${
                        formData.jenisTransaksi === "pemasukan" ? "jenis-label-active-pemasukan" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id="jenis-pemasukan"
                        name="jenisTransaksi"
                        value="pemasukan"
                        checked={formData.jenisTransaksi === "pemasukan"}
                        onChange={handleInputChange}
                        className="radio-hidden"
                      />
                      <i className="fas fa-arrow-down" />
                      <span>Pemasukan</span>
                    </label>

                    <label
                      htmlFor="jenis-pengeluaran"
                      className={`jenis-label ${
                        formData.jenisTransaksi === "pengeluaran" ? "jenis-label-active-pengeluaran" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        id="jenis-pengeluaran"
                        name="jenisTransaksi"
                        value="pengeluaran"
                        checked={formData.jenisTransaksi === "pengeluaran"}
                        onChange={handleInputChange}
                        className="radio-hidden"
                      />
                      <i className="fas fa-arrow-up" />
                      <span>Pengeluaran</span>
                    </label>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <input
                      type="text"
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Deskripsi"
                      required
                    />
                  </div>

                  <div className="form-group form-select-wrapper">
                    <select
                      id="kategori"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="form-input form-select"
                      required
                    >
                      <option value="" disabled>
                        Pilih Kategori
                      </option>
                      {getCategoryOptions().map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="select-icon">
                      <i className="fas fa-chevron-down" />
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      id="jumlah"
                      name="jumlah"
                      value={formData.jumlah}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Jumlah (Rp)"
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="date"
                      id="tanggal"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-full-width">
                  <button type="submit" className="submit-button gradient">
                    <i className="fas fa-save" /> Simpan Transaksi
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Transactions */}
            {loading ? null : (
              <div className="transactions-list-card">
                <h3 className="transaksi-title">Transaksi yang Baru Ditambahkan</h3>
                <div className="table-wrapper">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th className="table-header">Deskripsi</th>
                        <th className="table-header">Kategori</th>
                        <th className="table-header">Tanggal</th>
                        <th className="table-header table-header-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 5).map((tx) => (
                        <tr key={tx._id} className="table-row">
                          <td className="table-cell">
                            <div className="transaction-desc">
                              <div
                                className={`transaction-icon ${
                                  tx.jenis === "pemasukan"
                                    ? "icon-pemasukan"
                                    : "icon-pengeluaran"
                                }`}
                              >
                                <i
                                  className={`fas ${
                                    tx.jenis === "pemasukan"
                                      ? "fa-arrow-down"
                                      : "fa-arrow-up"
                                  }`}
                                />
                              </div>
                              <span className="transaction-text">{tx.deskripsi}</span>
                            </div>
                          </td>

                          <td className="table-cell">
                            <span className="category-badge">{tx.kategori}</span>
                          </td>

                          <td className="table-cell table-date">
                            {formatDate(tx.tanggal)}
                          </td>

                          <td className="table-cell table-cell-right">
                            <span
                              className={`amount-text ${
                                tx.jenis === "pemasukan"
                                  ? "amount-pemasukan"
                                  : "amount-pengeluaran"
                              }`}
                            >
                              {tx.jenis === "pemasukan" ? "+ " : "- "}
                              {formatCurrency(tx.jumlah)}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {transactions.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            style={{
                              textAlign: "center",
                              padding: 24,
                              color: "#888",
                            }}
                          >
                            Tidak ada transaksi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}