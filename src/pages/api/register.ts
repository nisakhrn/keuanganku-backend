import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body;

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Cek email sudah dipakai
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Registrasi berhasil!" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}