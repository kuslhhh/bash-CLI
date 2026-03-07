import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";

const echoCommand: CommandModule = {
  name: "echo",
  description: "Echo text.",
  async run(args, context) {
    const text = args.join(" ");
    await context.runner.runScript(`Write-Output ${psQuote(text)}`);
  },
};

export default echoCommand;

