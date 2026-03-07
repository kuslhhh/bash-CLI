import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";

const lsCommand: CommandModule = {
  name: "ls",
  description: "List directory contents.",
  async run(args, context) {
    const target = args[0] ?? ".";
    await context.runner.runScript(`Get-ChildItem -Force -Path ${psQuote(target)}`);
  },
};

export default lsCommand;
