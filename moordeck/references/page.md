# Moordeck Page Operations (`page.md`)

## Snapshots & Stale-Ref Safety

- Always capture a fresh snapshot (`mdk page snapshot --serial <n> --interactive-only --diff`) after navigation or major DOM transitions.
- Refs (`@e1`, `@e2`, ...) bind to a 4-tuple: `(profileId, generation, snapshotHash, nodeId)`. Acting on an outdated ref fails with HTTP `409 MOORDECK_STALE_REF`.
- Elements covered in Paint Order (`zIndex` / topmost rects) are pruned automatically to keep context dense.

## Out-of-Band Set-of-Mark (SoM) Screenshots

```bash
mdk page screenshot --serial 1 --som --out .tmp/annotated.png --json
```

Moordeck renders `@eN` callout badges onto the PNG in Node.js and redacts password, card, CVV, and OTP bounding boxes via Chromium's `redaction_boxes`. Page scripts observe zero DOM or style mutations.

## Multi-Tab & Passive WebMCP Discovery

```bash
mdk page tabs --serial 1 --json
mdk page webmcp --serial 1 --json
```

When a page declares `document.modelContext` (Chrome WebMCP), discover its declared tools via `webmcp`.

## Deterministic Batch Execution (`run_batch`)

Use `moordeck_exec` / `mdk page run-batch --file steps.json --serial 1` to run `navigate`, `click`, `fill`, `press`, `scroll`, `wait`, and `snapshot` in one round-trip. Any step that hits a verification challenge halts the batch cleanly and hands control to the human operator.
