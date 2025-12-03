import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const cookie = req.headers.cookie || "";
    const userId = cookie
      .split("; ")
      .find((x) => x.startsWith("userId="))
      ?.split("=")[1];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User belum login",
      });
    }

    const { name, phone, avatar, email } = req.body;

    const client = await clientPromise;
    const db = client.db("Keuanganku");

    // 🔥 hanya field yang dikirim yang di-update!
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (email) updateData.email = email; // ← TIDAK overwrite kalau tidak ada

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui!",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Gagal update profil",
      error: err.message,
    });
  }
}