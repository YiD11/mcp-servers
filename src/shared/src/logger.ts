export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private minLevel: number;

  constructor(
    private readonly name: string,
    level: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? "info",
  ) {
    this.minLevel = LEVEL_PRIORITY[level] ?? LEVEL_PRIORITY.info;
  }

  debug(message: string, ...args: unknown[]): void {
    this.log("debug", message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log("info", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("warn", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", message, ...args);
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (LEVEL_PRIORITY[level] < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.name}]`;

    // stdout is reserved for JSON-RPC in stdio transport
    console.error(`${prefix} ${message}`, ...args);
  }
}
