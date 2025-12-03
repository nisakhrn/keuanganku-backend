import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Hanya izinkan method POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Jika body tidak terbaca
    if (!req.body) {
      console.error("ERROR: req.body undefined!");
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { userEmail, jenis, deskripsi, kategori, jumlah, tanggal } = req.body;

    // Validasi data dasar
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    if (!jenis || !deskripsi || !kategori || !jumlah || !tanggal) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (jenis !== "pemasukan" && jenis !== "pengeluaran") {
      return res.status(400).json({
        success: false,
        message: "Invalid 'jenis' value",
      });
    }

    // Perbaikan: konversi jumlah
    const jumlahNumber = Number(jumlah);
    if (isNaN(jumlahNumber) || jumlahNumber <= 0) {
      return res.status(400).json({
        success: false,
        message: "Jumlah must be a valid number",
      });
    }

    // Koneksi Mongo
    const collection = await getTransactionCollection();
    if (!collection) {
      console.error("ERROR: MongoDB collection undefined!");
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }

    // Insert transaksi
    await collection.insertOne({
      userEmail,
      jenis,
      deskripsi,
      kategori,
      jumlah: jumlahNumber,
      tanggal,
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil disimpan",
    });

  } catch (err: any) {
    console.error("ERROR ADD:", err);

    return res.status(500).json({
      success: false,
      message: "Server error, check console or logs",
      error: err?.message ?? "unknown error"
    });
  }
}