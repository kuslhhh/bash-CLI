export class Logger {
  private readonly debugEnabled: boolean;

  constructor(debugEnabled = false) {
    this.debugEnabled = debugEnabled;
  }

  debug(message: string, ...details: unknown[]): void {
    if (!this.debugEnabled) {
      return;
    }
    const output = details.length > 0 ? `${message} ${details.map(String).join(" ")}` : message;
    process.stderr.write(`[ksh:debug] ${output}\n`);
  }

  error(message: string): void {
    process.stderr.write(`${message}\n`);
  }
}
