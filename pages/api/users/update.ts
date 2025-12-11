import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    logger.warn("Invalid method for /api/users/update", { method: req.method });
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const cookie = req.headers.cookie || "";
    const userId = cookie
      .split("; ")
      .find((x) => x.startsWith("userId="))
      ?.split("=")[1];

    if (!userId) {
      logger.warn("User update: user not logged in (no userId cookie)");
      return res.status(401).json({
        success: false,
        message: "User belum login",
      });
    }

    if (!ObjectId.isValid(userId)) {
      logger.warn("User update: invalid ObjectId from cookie", { userId });
      return res.status(400).json({
        success: false,
        message: "User ID tidak valid",
      });
    }

    const { name, phone, avatar, email } = req.body;

    const client = await clientPromise;
    const db = client.db("Keuanganku");

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      logger.warn("User update: empty body, nothing to update", { userId });
      return res.status(400).json({
        success: false,
        message: "Tidak ada data yang diupdate",
      });
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      logger.warn("User update: user not found", { userId });
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    logger.info("User profile updated", { userId, updateFields: Object.keys(updateData) });

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui!",
    });
  } catch (err: any) {
    logger.error("Unhandled error in /api/users/update", {
      error: err?.message,
      stack: err?.stack,
    });

    return res.status(500).json({
      success: false,
      message: "Gagal update profil",
      error: err.message,
    });
  }
}