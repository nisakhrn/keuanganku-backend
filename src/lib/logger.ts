// src/lib/logger.ts
type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: Record<string, any>) {
  const payload = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
  // sementara cukup console.log JSON
  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (message: string, meta?: Record<string, any>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, any>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, any>) => log("error", message, meta),
};