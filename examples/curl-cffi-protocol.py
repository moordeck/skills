"""Convert a logged-in Moordeck browser session into a matching `curl_cffi` HTTP client."""

import json
import os
import urllib.request


def fetch_descriptor(profile_id: str, domain: str | None = None) -> dict:
    base_url = os.environ.get("MOORDECK_API_URL", "http://127.0.0.1:9112").rstrip("/")
    token = os.environ.get("MOORDECK_TOKEN", "")
    qs = f"?domain={domain}" if domain else ""
    req = urllib.request.Request(
        f"{base_url}/api/v1/profiles/{profile_id}/http-descriptor{qs}",
        headers={
            **({"authorization": f"Bearer {token}"} if token else {}),
        },
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))["descriptor"]


if __name__ == "__main__":
    profile_id = os.environ.get("MOORDECK_PROFILE_ID", "")
    if not profile_id:
        raise SystemExit("Set MOORDECK_PROFILE_ID first")
    desc = fetch_descriptor(profile_id)
    print(desc["curlCffiSnippet"])
