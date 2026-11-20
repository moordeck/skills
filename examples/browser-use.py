"""Attach browser-use to a Moordeck stealth profile (`mode: 'cdp_compat'`)."""

import os
import urllib.request
import json


def start_moordeck_cdp_profile(serial_number: int = 1) -> str:
    base_url = os.environ.get("MOORDECK_API_URL", "http://127.0.0.1:9112").rstrip("/")
    token = os.environ.get("MOORDECK_TOKEN", "")
    req = urllib.request.Request(
        f"{base_url}/api/v1/browser/start",
        data=json.dumps({
            "serialNumber": serial_number,
            "mode": "cdp_compat",
            "cdp": True,
            "traceNet": True,
        }).encode("utf-8"),
        headers={
            "content-type": "application/json",
            **({"authorization": f"Bearer {token}"} if token else {}),
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    ws = payload.get("compatWsEndpoint") or payload.get("wsEndpoint")
    if not ws:
        raise RuntimeError(f"Moordeck did not return a compatWsEndpoint: {payload}")
    return ws


if __name__ == "__main__":
    cdp_url = start_moordeck_cdp_profile(1)
    print("Attach browser-use Browser(cdp_url=...) to:", cdp_url)
