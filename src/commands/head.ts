import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { parsePositiveInt, usage } from "./shared";

const headCommand: CommandModule = {
  name: "head",
  description: "Show the first lines of a file.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("head");
    }
    const lines = parsePositiveInt(args[1], 10);
    await context.runner.runScript(`Get-Content -Path ${psQuote(file)} -TotalCount ${lines}`);
  },
};

export default headCommand;

