import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "../../../src/lib/mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    logger.warn("Invalid method for /api/auth/login", { method: req.method });
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn("Login validation failed: missing email or password", { email });
      return res.status(400).json({ success: false, message: "Email dan password wajib diisi" });
    }

    const client = await clientPromise;
    const db = client.db("Keuanganku");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      logger.warn("Login failed: user not found", { email });
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      logger.warn("Login failed: wrong password", { email });
      return res.status(401).json({ success: false, message: "Email atau password salah" });
    }

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `userId=${user._id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    logger.info("Login success", { userId: user._id.toString(), email });

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    logger.error("Unhandled error in /api/auth/login", { error: err?.message, stack: err?.stack });
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server!", error: err.message });
  }
}