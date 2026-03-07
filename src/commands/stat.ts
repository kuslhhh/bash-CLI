import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const statCommand: CommandModule = {
  name: "stat",
  description: "Display file or directory metadata.",
  async run(args, context) {
    const target = args[0];
    if (!target) {
      usage("stat");
    }
    await context.runner.runScript(
      `Get-Item -LiteralPath ${psQuote(target)} | ` +
        "Select-Object FullName,Length,CreationTime,LastWriteTime,Attributes,Mode | Format-List",
    );
  },
};

export default statCommand;

