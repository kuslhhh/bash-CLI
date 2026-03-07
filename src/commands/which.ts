import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const whichCommand: CommandModule = {
  name: "which",
  description: "Show where a command resolves from.",
  async run(args, context) {
    const commandName = args[0];
    if (!commandName) {
      usage("which");
    }
    await context.runner.runScript(
      `$cmd = Get-Command -Name ${psQuote(commandName)} -ErrorAction Stop;` +
        "if ($cmd.Source) { $cmd.Source } else { $cmd.Definition }",
    );
  },
};

export default whichCommand;

