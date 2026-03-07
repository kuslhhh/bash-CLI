# ksh-bash

Fast Windows-only CLI that maps bash-like commands to PowerShell with TypeScript + Bun.

## Highlights

- TypeScript with strict mode
- Modular command registry with lazy command loading
- `spawn`-based execution for streaming output
- TTL cache for expensive commands (`du`, `find`, `ps`, `top`) in `.cache/`
- Debug logging via `--debug`
- Bundled CLI for fast startup (`tsup`)
- Vitest tests for cache, commands, and CLI behavior

## Install

```bash
npm i -g ksh-bash
```

## Usage

```bash
ksh --help
ksh --debug ls .
ksh find . *.ts
```

## Commands

### File system

`ls`, `cat`, `touch`, `mkdir`, `rmdir`, `rm`, `cp`, `mv`, `pwd`, `tree`, `stat`, `head`, `tail`, `wc`, `which`

### Search

`grep`, `find`

### System

`ps`, `kill`, `top`, `df`, `du`, `whoami`, `uptime`

### Utilities

`clear`, `echo`, `json`, `base64`, `uuid`, `hash`

## Development

```bash
bun install
bun run typecheck
bun run test
bun run build
```

## Project structure

```text
src/
  cli.ts
  commandRegistry.ts
  commands/
  shell/
  cache/
  utils/
  types/
  tests/
```

## Build output

- CLI binary: `dist/cli.js`
- npm bin mapping: `ksh -> dist/cli.js`

## License

MIT
