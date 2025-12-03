import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Sidebar from "../src/components/Sidebar";

interface Transaction {
  _id: string;
  userEmail: string;
  jenis: "pemasukan" | "pengeluaran";
  deskripsi: string;
  kategori: string;
  jumlah: number;
  tanggal: string;
}

export default function Riwayat() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Transaction | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "semua",
    startDate: "",
    endDate: "",
  });

  // Load user
  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userData);
    setCurrentUser(user);
  }, [router]);

  // Once user loaded, load transactions
  useEffect(() => {
    if (!currentUser) return;
    loadData();
  }, [currentUser]);

  // Apply filters
  useEffect(() => {
    let result = [...allTransactions];

    if (filters.search) {
      result = result.filter((t) =>
        t.deskripsi.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type !== "semua") {
      result = result.filter((t) => t.jenis === filters.type);
    }

    if (filters.startDate) {
      result = result.filter((t) => new Date(t.tanggal) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      result = result.filter((t) => new Date(t.tanggal) <= new Date(filters.endDate));
    }

    setFilteredTransactions(result);
  }, [filters, allTransactions]);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/transaksi/get?email=${currentUser.email}`);
      const data = await res.json();
      const tx = data.transactions || [];
      setAllTransactions(tx);
      setFilteredTransactions(tx);
    } catch (err) {
      console.error("Load data error:", err);
    }
  };

  const handleFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Hapus transaksi ini?")) return;

    try {
      const res = await fetch(`/api/transaksi/delete?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await loadData();
        alert("Transaksi berhasil dihapus!");
      } else {
        alert("Gagal menghapus transaksi");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  const startEdit = (tx: Transaction) => {
    setEditingId(tx._id);
    setEditForm({ ...tx });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    setEditForm((prev) => ({
      ...prev!,
      [e.target.name]: e.target.value,
    }));
  };

  const saveEdit = async () => {
    if (!editForm) return;

    try {
      const res = await fetch(`/api/transaksi/update?id=${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jenis: editForm.jenis,
          deskripsi: editForm.deskripsi,
          kategori: editForm.kategori,
          jumlah: editForm.jumlah,
          tanggal: editForm.tanggal,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await loadData();
        cancelEdit();
        alert("Transaksi berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui transaksi!");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Terjadi kesalahan saat menyimpan");
    }
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Riwayat Transaksi</h1>
        </header>

        <div className="dashboard-content">
          <div className="riwayat-card">
            {/* FILTERS */}
            <div className="riwayat-filters">
              <input
                type="text"
                name="search"
                placeholder="Cari deskripsi..."
                value={filters.search}
                onChange={handleFilter}
                className="filter-input"
              />

              <select
                name="type"
                value={filters.type}
                onChange={handleFilter}
                className="filter-select"
              >
                <option value="semua">Semua Jenis</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>

              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilter}
                className="filter-date"
              />

              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilter}
                className="filter-date"
              />
            </div>

            {/* TABLE */}
            <div className="table-wrapper-riwayat">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>DESKRIPSI</th>
                    <th>KATEGORI</th>
                    <th>TANGGAL</th>
                    <th className="text-right">JUMLAH</th>
                    <th className="text-center">AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx._id}>
                        {editingId === tx._id && editForm ? (
                          <>
                            <td>
                              <input
                                type="text"
                                name="deskripsi"
                                value={editForm.deskripsi}
                                onChange={handleEditChange}
                                className="edit-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                name="kategori"
                                value={editForm.kategori}
                                onChange={handleEditChange}
                                className="edit-input"
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                name="tanggal"
                                value={editForm.tanggal.split("T")[0]}
                                onChange={handleEditChange}
                                className="edit-input"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="jumlah"
                                value={editForm.jumlah}
                                onChange={handleEditChange}
                                className="edit-input"
                              />
                            </td>
                            <td className="text-center">
                              <button onClick={saveEdit} className="save-btn" title="Simpan">
                                <i className="fas fa-check" /> Simpan
                              </button>
                              <button onClick={cancelEdit} className="cancel-btn" title="Batal">
                                <i className="fas fa-times" /> Batal
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{tx.deskripsi}</td>
                            <td>{tx.kategori}</td>
                            <td>{new Date(tx.tanggal).toLocaleDateString("id-ID")}</td>
                            <td className={`text-right ${tx.jenis === "pemasukan" ? "positive" : "negative"}`}>
                              {tx.jenis === "pemasukan" ? "+ " : "- "}
                              {formatRupiah(tx.jumlah)}
                            </td>

                            <td className="text-center">
                              <button
                                onClick={() => startEdit(tx)}
                                className="edit-btn"
                                title="Edit"
                              >
                                <i className="fas fa-edit" />
                              </button>
                              <button
                                onClick={() => deleteTransaction(tx._id)}
                                className="delete-btn"
                                title="Hapus"
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        <i className="fas fa-search" />
                        <p>Tidak ada transaksi ditemukan.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}