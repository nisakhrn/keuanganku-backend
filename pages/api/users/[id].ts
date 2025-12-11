// pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
    logger.warn("User [id]: invalid id param", { id });
    return res.status(400).json({ success: false, message: "ID tidak valid" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("keuanganku");

    if (req.method === "GET") {
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

      if (!user) {
        logger.warn("User [id] GET: user not found", { id });
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      logger.info("User [id] GET: user fetched", { id });

      return res.status(200).json({ success: true, data: user });
    }

    if (req.method === "PUT") {
      const { name, phone, avatar } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (avatar !== undefined) updateData.avatar = avatar || null;

      if (Object.keys(updateData).length === 0) {
        logger.warn("User [id] PUT: empty body", { id });
        return res.status(400).json({
          success: false,
          message: "Tidak ada data yang diupdate",
        });
      }

      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        logger.warn("User [id] PUT: user not found", { id });
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }

      logger.info("User [id] PUT: user updated", {
        id,
        updateFields: Object.keys(updateData),
      });

      return res.status(200).json({
        success: true,
        message: "User berhasil diperbarui",
      });
    }

    logger.warn("User [id]: method not allowed", { method: req.method });
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  } catch (error: any) {
    logger.error("API Error in /api/users/[id]", {
      error: error?.message,
      stack: error?.stack,
    });
    return res.status(500).json({ success: false, message: "Server error" });
  }
}