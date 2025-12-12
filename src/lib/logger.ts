// src/lib/logger.ts
import fs from "fs";
import path from "path";

export type LogLevel = "info" | "warn" | "error";

const logFilePath = path.join(process.cwd(), "logs", "app.log");

function writeToFile(line: string) {
  try {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.appendFileSync(logFilePath, line + "\n");
  } catch {
    // Biarkan saja kalau gagal tulis file, jangan bikin API crash
  }
}

function log(level: LogLevel, message: string, meta?: Record<string, any>) {
  const payload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  const line = JSON.stringify(payload);

  console.log(line);        // buat Vercel / console
  writeToFile(line);        // buat Promtail / Loki
}

export const logger = {
  info: (message: string, meta?: Record<string, any>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, any>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, any>) => log("error", message, meta),
};