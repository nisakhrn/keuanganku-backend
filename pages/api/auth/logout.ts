import type { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../../src/lib/logger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", [
    `token=; Path=/; HttpOnly; Max-Age=0`,
    `session=; Path=/; HttpOnly; Max-Age=0`,
    `userId=; Path=/; HttpOnly; Max-Age=0`,
  ]);

  logger.info("Logout success", { ip: req.headers["x-forwarded-for"] ?? req.socket.remoteAddress });

  return res.status(200).json({
    success: true,
    message: "Logout berhasil",
  });
}