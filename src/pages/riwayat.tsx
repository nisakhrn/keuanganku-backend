// src/pages/riwayat.tsx
import Sidebar from '../components/Sidebar';

const Riwayat = () => {
  const transactions = [
    { id: 1, deskripsi: "Gaji", kategori: "Pemasukan", jumlah: 5000000, tanggal: "2023-10-10" },
    { id: 2, deskripsi: "Makan", kategori: "Pengeluaran", jumlah: 50000, tanggal: "2023-10-11" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Riwayat Transaksi</h1>
        </header>
        <div className="dashboard-content">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Deskripsi</th>
                <th>Kategori</th>
                <th>Tanggal</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.deskripsi}</td>
                  <td>{tx.kategori}</td>
                  <td>{tx.tanggal}</td>
                  <td>{tx.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Riwayat;