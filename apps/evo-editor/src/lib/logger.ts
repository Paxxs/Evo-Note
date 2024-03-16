enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

class Logger {
  private level: LogLevel;
  private includeTimestamp: boolean;

  constructor(includeTimestamp: boolean = false) {
    this.level =
      process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;
    this.includeTimestamp = includeTimestamp;
  }

  private log(level: LogLevel, ...messages: any[]) {
    if (level < this.level) return;
    const timestamp = this.includeTimestamp
      ? `[${new Date().toISOString()}] `
      : "";
    const color = this.getColor(level);
    console.log(
      `%c${timestamp}[${LogLevel[level]}]`,
      `color: ${color};`,
      ...messages,
    );
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return "gray";
      case LogLevel.INFO:
        return "blue";
      case LogLevel.WARN:
        return "orange";
      case LogLevel.ERROR:
        return "red";
      default:
        return "black";
    }
  }

  debug(...messages: any[]) {
    this.log(LogLevel.DEBUG, ...messages);
  }

  info(...messages: any[]) {
    this.log(LogLevel.INFO, ...messages);
  }

  warn(...messages: any[]) {
    this.log(LogLevel.WARN, ...messages);
  }

  error(...messages: any[]) {
    this.log(LogLevel.ERROR, ...messages);
  }
}

// 创建一个日志实例，配置是否包含时间戳
const logger = new Logger(true); // 设置为 true 以在日志中包含时间戳

export default logger;
