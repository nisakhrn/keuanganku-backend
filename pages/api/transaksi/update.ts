import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { ObjectId } from "mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    logger.warn("Invalid method for /api/transaksi/update", { method: req.method });
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const id = req.query.id;
  const { jenis, deskripsi, kategori, jumlah, tanggal } = req.body;

  if (!id || typeof id !== "string") {
    logger.warn("Update transaksi: missing id query", { id });
    return res.status(400).json({ success: false, message: "Missing id query" });
  }

  if (!ObjectId.isValid(id)) {
    logger.warn("Update transaksi: invalid ObjectId", { id });
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  if (!jenis || !deskripsi || !kategori || !jumlah || !tanggal) {
    logger.warn("Update transaksi: missing required fields", { body: req.body });
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const collection = await getTransactionCollection();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          jenis,
          deskripsi,
          kategori,
          jumlah: Number(jumlah),
          tanggal: new Date(tanggal),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      logger.warn("Update transaksi: transaction not found", { id });
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    logger.info("Transaction updated", { id, jenis, kategori, jumlah });

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: result.value,
    });
  } catch (error: any) {
    logger.error("ERROR UPDATE transaksi", {
      error: error?.message,
      stack: error?.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
}