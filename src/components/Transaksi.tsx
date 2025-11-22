// src/components/Transaksi.tsx
import { useState } from 'react';

const Transaksi = () => {
  const [transactionData, setTransactionData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Transaksi berhasil disimpan!');
  };

  return (
    <div className="transaksi-container">
      <h2>Tambah Transaksi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="description"
          placeholder="Deskripsi"
          value={transactionData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Jumlah"
          value={transactionData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={transactionData.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Simpan Transaksi</button>
      </form>
    </div>
  );
};

export default Transaksi;