import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";

const treeCommand: CommandModule = {
  name: "tree",
  description: "Show directory tree.",
  async run(args, context) {
    const target = args[0] ?? ".";
    await context.runner.runScript(`tree ${psQuote(target)} /F`);
  },
};

export default treeCommand;

