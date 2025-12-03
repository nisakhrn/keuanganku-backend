import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import clientPromise from "../../../src/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    const client = await clientPromise;
    const db = client.db("Keuanganku");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    // 🔥 SIMPAN COOKIE USER ID
    res.setHeader(
      "Set-Cookie",
      `userId=${user._id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server!",
      error: err.message,
    });
  }
}