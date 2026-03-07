import type { CommandModule } from "../types/command";
import { parsePositiveInt, runCachedScript } from "./shared";

const TOP_CACHE_TTL_MS = 5_000;

const topCommand: CommandModule = {
  name: "top",
  description: "Show top processes by CPU usage.",
  async run(args, context) {
    const count = parsePositiveInt(args[0], 10);
    const cacheKey = `top:${count}`;
    await runCachedScript(
      context,
      cacheKey,
      TOP_CACHE_TTL_MS,
      `Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First ${count} Name,Id,CPU,WorkingSet`,
    );
  },
};

export default topCommand;

