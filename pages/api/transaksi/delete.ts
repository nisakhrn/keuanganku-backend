import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { ObjectId } from "mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    logger.warn("Invalid method for /api/transaksi/delete", { method: req.method });
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const id = req.query.id;

  if (!id || typeof id !== "string") {
    logger.warn("Delete transaksi: missing id query", { id });
    return res.status(400).json({ success: false, message: "Missing id query" });
  }

  if (!ObjectId.isValid(id)) {
    logger.warn("Delete transaksi: invalid ObjectId", { id });
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const collection = await getTransactionCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      logger.warn("Delete transaksi: transaction not found", { id });
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    logger.info("Transaction deleted", { id });

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error: any) {
    logger.error("ERROR DELETE transaksi", {
      error: error?.message,
      stack: error?.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
}