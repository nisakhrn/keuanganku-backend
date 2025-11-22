// src/components/Riwayat.tsx
const Riwayat = () => {
  const transactions = [
    { id: 1, description: "Gaji", amount: 5000000, date: "2023-10-10" },
    { id: 2, description: "Makan", amount: -50000, date: "2023-10-11" },
  ];

  return (
    <div className="riwayat-container">
      <h2>Riwayat Transaksi</h2>
      <table>
        <thead>
          <tr>
            <th>Deskripsi</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.description}</td>
              <td>{tx.amount}</td>
              <td>{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Riwayat;