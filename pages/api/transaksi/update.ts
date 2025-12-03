import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const id = req.query.id;
  const { jenis, deskripsi, kategori, jumlah, tanggal } = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Missing id query" });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  if (!jenis || !deskripsi || !kategori || !jumlah || !tanggal) {
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
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction: result.value,
    });
  } catch (error) {
    console.error("ERROR UPDATE:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}