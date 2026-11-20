# Moordeck Agent Skills & Framework Examples

This directory contains the official Moordeck AI Agent skill package and integration examples for MCP clients, OpenClaw, Claude Code, Codex, Browser-Use, Stagehand, and `curl_cffi`.

## Quick Start

1. Print the live skill instructions straight from the local CLI:
   ```bash
   mdk skill
   ```
2. Verify desktop daemon health and supported kernels:
   ```bash
   mdk doctor --json
   ```
3. Point Streamable HTTP MCP clients to `http://127.0.0.1:9112/mcp` (or stdio clients to `mdk mcp`).

## Contents

- `moordeck/SKILL.md` & `moordeck/references/{page,net,security}.md` — Progressive-disclosure skill instructions
- `agent-browser-provider/moordeck-provider.mjs` — `agent-browser` / Playwright fenced CDP provider
- `examples/openclaw-mcp.json` — Streamable HTTP & stdio MCP config
- `examples/browser-use.py` — `browser-use` attachment via `compatWsEndpoint`
- `examples/stagehand.ts` — Stagehand / Playwright provider attachment
- `examples/curl-cffi-protocol.py` — Protocol conversion via `/api/v1/profiles/:id/http-descriptor`
