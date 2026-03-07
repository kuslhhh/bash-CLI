import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const catCommand: CommandModule = {
  name: "cat",
  description: "Print file contents.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("cat");
    }
    await context.runner.runScript(`Get-Content -Path ${psQuote(file)}`);
  },
};

export default catCommand;

