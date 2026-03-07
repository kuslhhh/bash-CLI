import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const grepCommand: CommandModule = {
  name: "grep",
  description: "Search a pattern inside a file.",
  async run(args, context) {
    const pattern = args[0];
    const file = args[1];
    if (!pattern || !file) {
      usage("grep");
    }
    await context.runner.runScript(
      `Select-String -Pattern ${psQuote(pattern)} -Path ${psQuote(file)} -CaseSensitive`,
    );
  },
};

export default grepCommand;

