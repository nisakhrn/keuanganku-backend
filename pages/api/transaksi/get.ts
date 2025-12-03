import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const email = req.query.email;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, message: "Missing email query" });
  }

  try {
    const collection = await getTransactionCollection();

    const transactions = await collection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("ERROR GET:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}