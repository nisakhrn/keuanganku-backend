import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db(process.env.DB_NAME);
      const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email tidak terdaftar" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Password salah" });
      }

      // Login berhasil
      res.status(200).json({ message: "Login berhasil!", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
