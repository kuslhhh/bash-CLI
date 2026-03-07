import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const touchCommand: CommandModule = {
  name: "touch",
  description: "Create an empty file.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("touch");
    }
    await context.runner.runScript(`New-Item -ItemType File -Path ${psQuote(file)} -Force | Out-Null`);
    await invalidateExpensiveCaches(context);
  },
};

export default touchCommand;

