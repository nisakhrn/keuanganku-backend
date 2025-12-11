import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../src/lib/mongodb";
import { ObjectId } from "mongodb";
import { logger } from "../../../src/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookie = req.headers.cookie || "";
    const userId = cookie
      .split("; ")
      .find((x) => x.startsWith("userId="))
      ?.split("=")[1];

    if (!userId) {
      logger.warn("me: userId cookie missing");
      return res.json({ success: false, user: null });
    }

    const client = await clientPromise;
    const db = client.db("Keuanganku");

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      logger.warn("me: user not found", { userId });
      return res.json({ success: false, user: null });
    }

    logger.info("me: user loaded", { userId });

    return res.json({ success: true, user });
  } catch (err: any) {
    logger.error("Unhandled error in /api/auth/me", {
      error: err?.message,
      stack: err?.stack,
    });
    return res.json({ success: false, user: null });
  }
}