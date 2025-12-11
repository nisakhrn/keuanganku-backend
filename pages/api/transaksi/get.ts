import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    logger.warn("Invalid method for /api/transaksi/get", { method: req.method });
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const email = req.query.email;

  if (!email || typeof email !== "string") {
    logger.warn("Get transaksi: missing email query", { email });
    return res.status(400).json({ success: false, message: "Missing email query" });
  }

  try {
    const collection = await getTransactionCollection();
    const transactions = await collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    logger.info("Transactions fetched", {
      userEmail: email,
      count: transactions.length,
    });

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    logger.error("ERROR GET transaksi", {
      error: error?.message,
      stack: error?.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
}