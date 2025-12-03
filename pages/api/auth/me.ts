import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookie = req.headers.cookie || "";
    const userId = cookie
      .split("; ")
      .find((x) => x.startsWith("userId="))
      ?.split("=")[1];

    if (!userId) {
      return res.json({ success: false, user: null });
    }

    const client = await clientPromise;
    const db = client.db("Keuanganku");

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.json({ success: false, user: null });
    }

    return res.json({ success: true, user });
  } catch (err: any) {
    return res.json({ success: false, user: null });
  }
}