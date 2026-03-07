import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const rmdirCommand: CommandModule = {
  name: "rmdir",
  description: "Remove a directory recursively.",
  async run(args, context) {
    const directory = args[0];
    if (!directory) {
      usage("rmdir");
    }
    await context.runner.runScript(`Remove-Item -LiteralPath ${psQuote(directory)} -Recurse -Force`);
    await invalidateExpensiveCaches(context);
  },
};

export default rmdirCommand;

