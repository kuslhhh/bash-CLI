import path from "node:path";
import { pathToFileURL } from "node:url";

import packageJson from "../package.json";
import { CacheManager } from "./cache/cacheManager";
import { CommandRegistry } from "./commandRegistry";
import { PowerShellRunner } from "./shell/powershellRunner";
import type { CommandContext, ShellRunner } from "./types/command";
import { Logger } from "./utils/logger";

interface ParsedGlobalArgs {
  debug: boolean;
  help: boolean;
  version: boolean;
  positional: string[];
}

interface RegistryLike {
  load(name: string): Promise<{ run(args: string[], context: CommandContext): Promise<void> } | null>;
  listByCategory(): ReturnType<CommandRegistry["listByCategory"]>;
}

interface CliDependencies {
  logger?: Logger;
  cache?: CacheManager;
  runner?: ShellRunner;
  registry?: RegistryLike;
  version?: string;
  cwd?: string;
  platform?: NodeJS.Platform;
}

const VERSION = packageJson.version;

export function parseGlobalArgs(argv: string[]): ParsedGlobalArgs {
  let debug = false;
  let help = false;
  let version = false;
  let passthrough = false;
  const positional: string[] = [];

  for (const arg of argv) {
    if (passthrough) {
      positional.push(arg);
      continue;
    }

    if (arg === "--") {
      passthrough = true;
      continue;
    }

    if (arg === "--debug") {
      debug = true;
      continue;
    }

    if (arg === "-h" || arg === "--help") {
      help = true;
      continue;
    }

    if (arg === "-v" || arg === "--version") {
      version = true;
      continue;
    }

    positional.push(arg);
  }

  return {
    debug,
    help,
    version,
    positional,
  };
}

export function buildHelpText(
  registry: Pick<RegistryLike, "listByCategory">,
  version: string,
): string {
  const grouped = registry.listByCategory();
  const lines: string[] = [];

  lines.push(`ksh-bash v${version}`);
  lines.push("Fast bash-like Windows CLI powered by PowerShell.");
  lines.push("");
  lines.push("Usage:");
  lines.push("  ksh [--debug] <command> [args]");
  lines.push("");
  lines.push("Global options:");
  lines.push("  --debug           Enable debug logs.");
  lines.push("  -h, --help        Show help.");
  lines.push("  -v, --version     Show version.");
  lines.push("");

  const sectionOrder: Array<keyof typeof grouped> = ["filesystem", "search", "system", "utility"];
  for (const section of sectionOrder) {
    const sectionTitle = `${section.charAt(0).toUpperCase()}${section.slice(1)}`;
    lines.push(`${sectionTitle} commands:`);
    for (const command of grouped[section]) {
      lines.push(`  ${command.name.padEnd(8)} ${command.description}`);
    }
    lines.push("");
  }

  lines.push("Cache:");
  lines.push("  Expensive commands (du, find, ps, top) use TTL-based cache in .cache/");

  return `${lines.join("\n")}\n`;
}

function isMainModule(): boolean {
  const entryFile = process.argv[1];
  if (!entryFile) {
    return false;
  }
  return import.meta.url === pathToFileURL(entryFile).href;
}

export async function runCli(argv: string[], dependencies: CliDependencies = {}): Promise<number> {
  const parsed = parseGlobalArgs(argv);
  const logger = dependencies.logger ?? new Logger(parsed.debug);

  const platform = dependencies.platform ?? process.platform;
  if (platform !== "win32") {
    logger.error("ksh-bash supports Windows only.");
    return 1;
  }

  const cwd = dependencies.cwd ?? process.cwd();
  const cache =
    dependencies.cache ??
    new CacheManager({
      cacheDir: path.join(cwd, ".cache"),
      logger,
    });
  const runner = dependencies.runner ?? new PowerShellRunner(logger);
  const registry = dependencies.registry ?? new CommandRegistry();
  const version = dependencies.version ?? VERSION;

  void cache.cleanup().catch((error) => {
    logger.debug(`cache cleanup failed: ${(error as Error).message}`);
  });

  if (parsed.version) {
    process.stdout.write(`${version}\n`);
    return 0;
  }

  if (parsed.help || parsed.positional.length === 0) {
    process.stdout.write(buildHelpText(registry, version));
    return 0;
  }

  const [commandNameRaw, ...commandArgs] = parsed.positional;
  if (!commandNameRaw) {
    process.stdout.write(buildHelpText(registry, version));
    return 0;
  }
  const commandName = commandNameRaw.toLowerCase();
  const command = await registry.load(commandName);

  if (!command) {
    logger.error(`Unknown command: ${commandName}`);
    process.stdout.write(buildHelpText(registry, version));
    return 1;
  }

  try {
    await command.run(commandArgs, { runner, cache, logger, cwd });
    return 0;
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return 1;
  }
}

if (isMainModule()) {
  runCli(process.argv.slice(2))
    .then((code) => {
      process.exit(code);
    })
    .catch((error) => {
      process.stderr.write(`${(error as Error).message}\n`);
      process.exit(1);
    });
}
