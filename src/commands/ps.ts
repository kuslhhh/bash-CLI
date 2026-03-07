import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { runCachedScript } from "./shared";

const PS_CACHE_TTL_MS = 10_000;

const psCommand: CommandModule = {
  name: "ps",
  description: "List running processes.",
  async run(args, context) {
    const filter = args[0];
    const cacheKey = `ps:${filter ?? "*"}`;

    const script = filter
      ? `Get-Process -Name ${psQuote(filter)} | ` +
        "Sort-Object -Property CPU -Descending | Select-Object Name,Id,CPU,WorkingSet"
      : "Get-Process | Sort-Object -Property CPU -Descending | Select-Object Name,Id,CPU,WorkingSet";

    await runCachedScript(context, cacheKey, PS_CACHE_TTL_MS, script);
  },
};

export default psCommand;

