# Provenance

Installed from https://github.com/JuliusBrussee/caveman
Commit: 2e08b9177c07bb7249a8a2d1a6758e5db281d002 (2026-10-08, release 3.2.0)
Upstream path: skills/caveman/

Copyright 2026 Julius Brussee. Licensed under the Apache License 2.0 (see
LICENSE). Contributions made before 3.0.0 remain available under the MIT
License, whose notice is kept in LICENSE-MIT.

SKILL.md and README.md are byte-identical to upstream. They have not been
edited. To update, diff against upstream and review the change before
copying it in, since this file steers agent behavior.

## What is installed

Only the core `caveman` skill (two markdown files, no scripts, no network
calls). Verified by reading both files in full before installing.

## What is deliberately not installed

The upstream repository is a larger toolchain. None of the following was
installed or run:

- the CLI, the token-compression proxy, `browse`, the editor extension, or
  the MCP server
- hooks (SessionStart or statusline) and the platform installers
- the sibling skills `ultracave` and `megacave`. SKILL.md refers to them:
  `/caveman ultra` and `/caveman wenyan` are aliases that tell the agent to
  follow those skills, so those two aliases do nothing here unless the
  siblings are added.

The upstream NOTICE file lists third-party attributions for engine and
browse code. That code is not part of this copy, so NOTICE is not reproduced.

## How it behaves in this repo

The skill is a terse response style. It turns on when someone says
`/caveman` or asks for fewer tokens, and stays on until "stop caveman" or
"normal mode". Its own rules exempt anything persisted outside chat (code,
comments, commits, docs, tickets), so reports in ORCHESTRATION.md and
commit messages stay in normal prose.
