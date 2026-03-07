import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { runCachedScript } from "./shared";

const FIND_CACHE_TTL_MS = 60_000;

const findCommand: CommandModule = {
  name: "find",
  description: "Find files by wildcard pattern.",
  async run(args, context) {
    const root = args[0] ?? ".";
    const pattern = args[1] ?? "*";
    const cacheKey = `find:${root}:${pattern}`;

    await runCachedScript(
      context,
      cacheKey,
      FIND_CACHE_TTL_MS,
      `Get-ChildItem -Path ${psQuote(root)} -Recurse -Force -Filter ${psQuote(pattern)} ` +
        "-ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName",
    );
  },
};

export default findCommand;

