import type { CacheManager } from "../cache/cacheManager";
import type { Logger } from "../utils/logger";
import type { RunResult, SpawnProcessOptions } from "../utils/processRunner";

export interface ShellRunner {
  runScript(script: string, options?: Omit<SpawnProcessOptions, "cwd"> & { cwd?: string }): Promise<RunResult>;
}

export interface CommandContext {
  runner: ShellRunner;
  cache: CacheManager;
  logger: Logger;
  cwd: string;
}

export interface CommandModule {
  name: string;
  description: string;
  run(args: string[], context: CommandContext): Promise<void>;
}

export interface CommandDefinition {
  name: string;
  description: string;
  load: () => Promise<CommandModule>;
}
