import { spawn } from "node:child_process";

export interface SpawnProcessOptions {
  cwd?: string;
  streamOutput?: boolean;
  captureOutput?: boolean;
  allowNonZeroExit?: boolean;
  env?: NodeJS.ProcessEnv;
}

export interface RunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export class ProcessExitError extends Error {
  readonly exitCode: number;
  readonly stderr: string;
  readonly stdout: string;

  constructor(command: string, exitCode: number, stdout: string, stderr: string) {
    super(`Command failed (${exitCode}): ${command}`);
    this.name = "ProcessExitError";
    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export async function spawnProcess(
  binary: string,
  args: string[],
  options: SpawnProcessOptions = {},
): Promise<RunResult> {
  const streamOutput = options.streamOutput ?? true;
  const captureOutput = options.captureOutput ?? false;
  const allowNonZeroExit = options.allowNonZeroExit ?? false;

  return new Promise<RunResult>((resolve, reject) => {
    const child = spawn(binary, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      shell: false,
      windowsHide: true,
      stdio: ["inherit", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer | string) => {
      const text = chunk.toString();
      if (captureOutput) {
        stdout += text;
      }
      if (streamOutput) {
        process.stdout.write(text);
      }
    });

    child.stderr?.on("data", (chunk: Buffer | string) => {
      const text = chunk.toString();
      if (captureOutput) {
        stderr += text;
      }
      if (streamOutput) {
        process.stderr.write(text);
      }
    });

    child.on("error", reject);
    child.on("close", (code) => {
      const exitCode = code ?? 0;
      if (exitCode !== 0 && !allowNonZeroExit) {
        reject(new ProcessExitError(`${binary} ${args.join(" ")}`, exitCode, stdout, stderr));
        return;
      }
      resolve({
        exitCode,
        stdout,
        stderr,
      });
    });
  });
}
