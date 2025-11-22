import { NextApiRequest, NextApiResponse } from 'next';

const transaction = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { jenisTransaksi, deskripsi, kategori, jumlah, tanggal } = req.body;

    // Logika untuk menyimpan transaksi ke database (misalnya MongoDB)
    // Simpan transaksi dalam database atau session
    
    res.status(201).json({ message: 'Transaksi berhasil disimpan', transaction: { jenisTransaksi, deskripsi, kategori, jumlah, tanggal } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default transaction;