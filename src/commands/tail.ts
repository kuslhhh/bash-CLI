import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { parsePositiveInt, usage } from "./shared";

const tailCommand: CommandModule = {
  name: "tail",
  description: "Show the last lines of a file.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("tail");
    }
    const lines = parsePositiveInt(args[1], 10);
    await context.runner.runScript(`Get-Content -Path ${psQuote(file)} -Tail ${lines}`);
  },
};

export default tailCommand;

