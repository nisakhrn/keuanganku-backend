// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ success: false, message: "ID tidak valid" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("keuanganku");

    if (req.method === "GET") {
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      return res.status(200).json({ success: true, data: user });
    }

    if (req.method === "PUT") {
      const { name, phone, avatar } = req.body;

      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name,
            phone,
            avatar: avatar || null,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "User berhasil diperbarui",
      });
    }

    return res.status(405).json({ success: false, message: "Method tidak diizinkan" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}