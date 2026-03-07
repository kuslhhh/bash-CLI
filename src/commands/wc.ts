import { psQuote } from "../shell/powershellRunner";
import type { CommandModule } from "../types/command";
import { usage } from "./shared";

const wcCommand: CommandModule = {
  name: "wc",
  description: "Count lines, words, and characters in a file.",
  async run(args, context) {
    const file = args[0];
    if (!file) {
      usage("wc");
    }
    await context.runner.runScript(
      `$file = ${psQuote(file)};` +
        "$content = Get-Content -Path $file -Raw -ErrorAction Stop;" +
        "$lines = (Get-Content -Path $file | Measure-Object -Line).Lines;" +
        "$words = ($content | Measure-Object -Word).Words;" +
        "$chars = ($content | Measure-Object -Character).Characters;" +
        'Write-Output "$lines $words $chars $file";',
    );
  },
};

export default wcCommand;

