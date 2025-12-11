import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    logger.warn("Invalid method for /api/transaksi/add", { method: req.method });
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    if (!req.body) {
      logger.error("Request body missing on /api/transaksi/add");
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const { userEmail, jenis, deskripsi, kategori, jumlah, tanggal } = req.body;

    if (!userEmail) {
      logger.warn("Validation failed: userEmail required", { body: req.body });
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    if (!jenis || !deskripsi || !kategori || !jumlah || !tanggal) {
      logger.warn("Validation failed: missing required fields", { body: req.body });
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (jenis !== "pemasukan" && jenis !== "pengeluaran") {
      logger.warn("Validation failed: invalid jenis", { jenis });
      return res.status(400).json({
        success: false,
        message: "Invalid 'jenis' value",
      });
    }

    const jumlahNumber = Number(jumlah);
    if (isNaN(jumlahNumber) || jumlahNumber <= 0) {
      logger.warn("Validation failed: invalid jumlah", { jumlah });
      return res.status(400).json({
        success: false,
        message: "Jumlah must be a valid number",
      });
    }

    const collection = await getTransactionCollection();
    if (!collection) {
      logger.error("MongoDB collection undefined on /api/transaksi/add");
      return res.status(500).json({
        success: false,
        message: "Database connection failed",
      });
    }

    await collection.insertOne({
      userEmail,
      jenis,
      deskripsi,
      kategori,
      jumlah: jumlahNumber,
      tanggal,
      createdAt: new Date(),
    });

    logger.info("Transaction created", {
      userEmail,
      jenis,
      kategori,
      jumlah: jumlahNumber,
    });

    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil disimpan",
    });
  } catch (err: any) {
    logger.error("Unhandled error in /api/transaksi/add", {
      error: err?.message,
      stack: err?.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Server error, check console or logs",
      error: err?.message ?? "unknown error",
    });
  }
}