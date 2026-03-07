import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const rmCommand: CommandModule = {
  name: "rm",
  description: "Remove a file.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("rm");
    }
    await context.runner.runScript(`Remove-Item -LiteralPath ${psQuote(file)} -Force`);
    await invalidateExpensiveCaches(context);
  },
};

export default rmCommand;

