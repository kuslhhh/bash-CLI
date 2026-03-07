import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const cpCommand: CommandModule = {
  name: "cp",
  description: "Copy files or directories.",
  async run(args, context) {
    const source = args[0];
    const destination = args[1];
    if (!source || !destination) {
      usage("cp");
    }
    await context.runner.runScript(
      `Copy-Item -Path ${psQuote(source)} -Destination ${psQuote(destination)} -Recurse -Force`,
    );
    await invalidateExpensiveCaches(context);
  },
};

export default cpCommand;

