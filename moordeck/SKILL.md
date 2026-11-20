---
name: moordeck
description: Operate Moordeck anti-detect browser profiles safely with zero-CDP native control, isolated fingerprints, human handoff fences, NetTap tracing, and protocol handoff.
---

# Moordeck AI Browser Skill

Operate isolated Moordeck desktop profiles via the Local MCP server (`http://127.0.0.1:9112/mcp` or stdio bridge `mdk mcp`) or the `mdk` CLI.

## Core Loop

1. **Check daemon health**:
   ```bash
   mdk doctor --json
   ```
2. **Launch an isolated stealth session** (`mode: "agent"` uses the zero-CDP native IPC bridge when running kernel `mc-155-v2+`, keeping `--remote-debugging-port` disabled):
   ```bash
   mdk browser start --serial 1 --mode agent --trace-net --json
   ```
   Optional guardrails: `--allowed-domains example.com,*.example.com`, `--background`.
3. **Inspect before acting** (snapshot + line diff + compact `@eN` refs):
   ```bash
   mdk page snapshot --serial 1 --interactive-only --diff --json
   ```
4. **Act through humanized input & code-first batching**:
   ```bash
   mdk page click @e3 --serial 1 --json
   mdk page fill @e5 "query" --serial 1 --json
   mdk page press Enter --serial 1 --json
   ```
   When multiple steps follow a known flow, send a single `mdk page run-batch` (or `moordeck_exec`) request.
5. **Respect Human-in-the-Loop Fences (`HTTP 423`)**:
   If Sentinel or the user enters `human_takeover`, write operations return `423`. Call:
   ```bash
   mdk browser focus --serial 1 --json
   mdk handoff wait --serial 1 --json
   ```
   Resume only after the human releases control back to the agent.
6. **Convert to headless HTTP protocols (`curl_cffi`) or replay Flows**:
   Read references as needed:
   - Page operations & SoM screenshots: [references/page.md](./references/page.md)
   - NetTap traces & `curl_cffi` export: [references/net.md](./references/net.md)
   - Scoped keys, domain allowlists & security boundaries: [references/security.md](./references/security.md)
