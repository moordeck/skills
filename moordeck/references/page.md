# Moordeck Page Operations (`page.md`)

## Snapshots & Stale-Ref Safety

- Always capture a fresh snapshot (`mdk page snapshot --serial <n> --interactive-only --diff`) after navigation or major DOM transitions.
- Refs (`@e1`, `@e2`, ...) bind to a 4-tuple: `(profileId, targetSessionId, documentId, backendNodeId)` plus live DOM presence & bounding-box drift validation. Acting on an outdated ref fails with HTTP `409 MOORDECK_STALE_REF`.
- Elements covered by higher-`zOrder` overlays in Paint Order are pruned automatically to keep context dense without hiding children inside modals or iframes.

## Out-of-Band Set-of-Mark (SoM) Screenshots

```bash
mdk page screenshot --serial 1 --som --out .tmp/annotated.png --json
```

Moordeck scales DIP snapshot geometry to PNG pixel resolution out-of-band in Node.js to render `@eN` callout badges and fail-closed opaque redaction bars over password, card, CVV, and OTP boxes. Page scripts observe zero DOM or style mutations.

## Multi-Tab & Passive WebMCP Discovery

```bash
mdk page tabs --serial 1 --json
mdk page webmcp --serial 1 --json
```

When a page declares `document.modelContext` (Chrome WebMCP), discover its declared tools via `webmcp`.

## Deterministic Batch Execution (`run_batch`)

Use `moordeck_exec` / `mdk page run-batch --file steps.json --serial 1` to run `navigate`, `click`, `fill`, `press`, `scroll`, `wait`, and `snapshot` in one round-trip. Any step that hits a verification challenge halts the batch cleanly and hands control to the human operator.
