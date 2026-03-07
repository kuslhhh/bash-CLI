import { spawnProcess } from "../utils/processRunner";
import type { RunResult, SpawnProcessOptions } from "../utils/processRunner";
import type { Logger } from "../utils/logger";

export type RunPowerShellOptions = SpawnProcessOptions;

export function psQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

export class PowerShellRunner {
  private readonly executable: string;
  private readonly logger: Logger;

  constructor(logger: Logger, executable = "powershell.exe") {
    this.logger = logger;
    this.executable = executable;
  }

  async runScript(script: string, options: RunPowerShellOptions = {}): Promise<RunResult> {
    this.logger.debug("powershell.run", script);
    return spawnProcess(
      this.executable,
      ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script],
      options,
    );
  }
}
