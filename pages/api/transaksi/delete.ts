import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionCollection } from "../../../src/models/transaction";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const id = req.query.id;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "Missing id query" });
  }

  // Validasi ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const collection = await getTransactionCollection();

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("ERROR DELETE:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}