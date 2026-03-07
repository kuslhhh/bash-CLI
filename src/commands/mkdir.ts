import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { invalidateExpensiveCaches, usage } from "./shared";

const mkdirCommand: CommandModule = {
  name: "mkdir",
  description: "Create a directory.",
  async run(args, context) {
    const directory = args[0];
    if (!directory) {
      usage("mkdir");
    }
    await context.runner.runScript(
      `New-Item -ItemType Directory -Path ${psQuote(directory)} -Force | Out-Null`,
    );
    await invalidateExpensiveCaches(context);
  },
};

export default mkdirCommand;

