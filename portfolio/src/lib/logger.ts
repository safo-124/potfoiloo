type LogLevel = "info" | "warn" | "error";

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
}

export const logger = {
  info(context: string, message: string, data?: unknown) {
    console.log(formatMessage("info", context, message), data ?? "");
  },
  warn(context: string, message: string, data?: unknown) {
    console.warn(formatMessage("warn", context, message), data ?? "");
  },
  error(context: string, message: string, error?: unknown) {
    console.error(
      formatMessage("error", context, message),
      error instanceof Error ? { message: error.message, stack: error.stack } : error ?? ""
    );
  },
};
