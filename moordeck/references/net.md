# Moordeck NetTap & Protocol Handoff (`net.md`)

## Browser-Process Passive NetTap (`--trace-net`)

Start sessions with `--trace-net`:

```bash
mdk browser start --serial 1 --mode agent --trace-net --json
```

Chromium's browser process streams real request metadata directly over an inherited pipe without page hooks or Debugger banners:

```bash
mdk net list --serial 1 --json
mdk net get <requestId> --serial 1 --json
mdk net traces --serial 1 --json
mdk net export --serial 1 --format har --out trace.har --json
```

Static assets (`image`, `font`, `stylesheet`) are filtered by default; pass `--include-static` to inspect all traffic. Sensitive headers (`cookie`, `set-cookie`, `authorization`, `proxy-authorization`, `x-api-key`, `x-csrf-token`) are redacted by default unless `admin:cookies` is granted and `--no-redact` is explicitly requested. Each captured endpoint is classified as `public_readonly`, `cookie_replayable`, or `dynamic_signed_suspect`.

## Hand Off to `curl_cffi` (`http-descriptor`)

Fetch the exact aligned headers, `Sec-CH-UA*` client hints, decrypted session cookies (requires `admin:cookies`), closest `curl_cffi` TLS impersonation target with `CurlHttpVersion.V2_0`, and local session proxy endpoint:

```bash
mdk profiles http-descriptor --serial 1 --domain app.example.com --json
```

## Record & Replay UI Flows

Save successful Step Traces as parameterized UI Flows and replay them deterministically without LLM calls:

```bash
mdk flow save --serial 1 --name daily-export --json
mdk flow run --flow <flowId> --serial 1 --vars '{"query":"reports"}' --json
```
