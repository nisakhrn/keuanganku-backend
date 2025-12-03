import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb"; // Path menggunakan alias
import bcrypt from "bcryptjs"; // Untuk mengenkripsi password

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Semua kolom wajib diisi!" });
    }

    try {
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection("users");

      // Cek apakah email sudah ada di database
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email sudah terdaftar!" });
      }

      // Enkripsi password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const newUser = { name, email, password: hashedPassword };
      await usersCollection.insertOne(newUser);

      return res.status(201).json({ message: "Registrasi berhasil!" });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    }
  } else {
    res.status(405).json({ message: "Metode tidak diizinkan" });
  }
};

export default handler;