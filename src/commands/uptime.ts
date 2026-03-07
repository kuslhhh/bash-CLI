import type { CommandModule } from "../types/command";

const uptimeCommand: CommandModule = {
  name: "uptime",
  description: "Show system uptime.",
  async run(_args, context) {
    await context.runner.runScript(
      "$boot = (Get-CimInstance Win32_OperatingSystem).LastBootUpTime;" +
        "$up = (Get-Date) - $boot;" +
        'Write-Output ("{0}d {1}h {2}m {3}s" -f [int]$up.TotalDays, $up.Hours, $up.Minutes, $up.Seconds);',
    );
  },
};

export default uptimeCommand;

