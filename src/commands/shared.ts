import type { CommandContext } from "../types/command";

export function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

export function usage(command: string): never {
  throw new Error(`Invalid arguments. Run "ksh --help" or "ksh ${command} --help".`);
}

export async function runCachedScript(
  context: CommandContext,
  key: string,
  ttlMs: number,
  script: string,
): Promise<void> {
  const cachedOutput = await context.cache.get<string>(key);
  if (cachedOutput !== null) {
    context.logger.debug(`cache hit: ${key}`);
    process.stdout.write(cachedOutput);
    return;
  }

  const result = await context.runner.runScript(script, {
    streamOutput: true,
    captureOutput: true,
  });
  await context.cache.set(key, result.stdout, ttlMs);
}

export async function invalidateExpensiveCaches(context: CommandContext): Promise<void> {
  await Promise.all([
    context.cache.invalidatePrefix("du:"),
    context.cache.invalidatePrefix("find:"),
    context.cache.invalidatePrefix("ps:"),
    context.cache.invalidatePrefix("top:"),
  ]);
}
