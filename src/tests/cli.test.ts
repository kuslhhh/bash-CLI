import { describe, expect, it } from "vitest";

import { buildHelpText, parseGlobalArgs } from "../cli";
import { CommandRegistry } from "../commandRegistry";

describe("cli", () => {
  it("parses global flags and preserves command args", () => {
    const parsed = parseGlobalArgs(["--debug", "ls", "-la", "--", "--help"]);
    expect(parsed).toEqual({
      debug: true,
      help: false,
      version: false,
      positional: ["ls", "-la", "--help"],
    });
  });

  it("renders stable help header (snapshot)", () => {
    const helpText = buildHelpText(new CommandRegistry(), "9.9.9-test");
    const header = helpText.split("\n").slice(0, 12).join("\n");
    expect(header).toMatchInlineSnapshot(`
      "ksh-bash v9.9.9-test
      Fast bash-like Windows CLI powered by PowerShell.

      Usage:
        ksh [--debug] <command> [args]

      Global options:
        --debug           Enable debug logs.
        -h, --help        Show help.
        -v, --version     Show version.

      Filesystem commands:"
    `);
  });
});
