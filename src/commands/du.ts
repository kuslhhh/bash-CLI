import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { runCachedScript } from "./shared";

const DU_CACHE_TTL_MS = 60_000;

const duCommand: CommandModule = {
  name: "du",
  description: "Estimate directory space usage.",
  async run(args, context) {
    const target = args[0] ?? ".";
    const cacheKey = `du:${target}`;
    await runCachedScript(
      context,
      cacheKey,
      DU_CACHE_TTL_MS,
      `$path = ${psQuote(target)};` +
        "$size = (Get-ChildItem -Path $path -Recurse -Force -File -ErrorAction SilentlyContinue | " +
        "Measure-Object -Property Length -Sum).Sum;" +
        "if ($null -eq $size) { $size = 0 };" +
        '$mb = [math]::Round($size / 1MB, 2); Write-Output "$size bytes"; Write-Output "$mb MB";',
    );
  },
};

export default duCommand;

