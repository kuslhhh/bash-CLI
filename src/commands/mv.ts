import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const mvCommand: CommandModule = {
  name: "mv",
  description: "Move files or directories.",
  async run(args, context) {
    const source = args[0];
    const destination = args[1];
    if (!source || !destination) {
      usage("mv");
    }
    await context.runner.runScript(
      `Move-Item -Path ${psQuote(source)} -Destination ${psQuote(destination)} -Force`,
    );
    await invalidateExpensiveCaches(context);
  },
};

export default mvCommand;

