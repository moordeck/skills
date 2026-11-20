/**
 * Moordeck `--provider` adapter for `agent-browser` or custom Playwright harnesses.
 *
 * Launches or resolves a Moordeck profile in `mode: "cdp_compat"` so callers get
 * a fenced loopback WebSocket URL protected by Hard Handoff Fence and per-profile netguard.
 *
 * Usage:
 *   import { createMoordeckProvider } from './moordeck-provider.mjs'
 *   const provider = createMoordeckProvider({ baseUrl: 'http://127.0.0.1:9112', token: process.env.MOORDECK_TOKEN })
 *   const session = await provider.acquire({ serialNumber: 1 })
 *   // Connect playwright.chromium.connectOverCDP(session.wsEndpoint)
 *   await provider.release(session.profileId)
 */

export function createMoordeckProvider(options = {}) {
  const baseUrl = (options.baseUrl || process.env.MOORDECK_API_URL || 'http://127.0.0.1:9112').replace(/\/$/, '')
  const token = options.token || process.env.MOORDECK_TOKEN || ''

  async function request(pathname, init = {}) {
    const res = await fetch(`${baseUrl}${pathname}`, {
      method: init.method || 'GET',
      headers: {
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(init.timeoutMs || 45_000),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const err = new Error(data?.error || `HTTP ${res.status} on ${pathname}`)
      err.status = res.status
      throw err
    }
    return data
  }

  return {
    async acquire({ profileId, serialNumber, headless = false, allowedDomains, traceNet = true } = {}) {
      const active = await request('/api/v1/browser/active')
      const existing = (active.sessions || []).find(
        (s) =>
          (profileId && s.profileId === profileId) ||
          (serialNumber !== undefined && s.serialNumber === serialNumber),
      )
      if (existing?.compatWsEndpoint || existing?.cdpWsEndpoint) {
        return {
          profileId: existing.profileId,
          serialNumber: existing.serialNumber,
          wsEndpoint: existing.compatWsEndpoint || existing.cdpWsEndpoint,
          proxyUrl: existing.proxyUrl,
          reused: true,
        }
      }
      const started = await request('/api/v1/browser/start', {
        method: 'POST',
        body: {
          ...(profileId ? { profileId } : { serialNumber }),
          mode: 'cdp_compat',
          cdp: true,
          headless,
          traceNet,
          ...(allowedDomains ? { allowedDomains } : {}),
        },
      })
      return {
        profileId: started.profileId,
        serialNumber: started.serialNumber,
        wsEndpoint: started.compatWsEndpoint || started.wsEndpoint,
        proxyUrl: started.proxyUrl,
        reused: false,
      }
    },

    async handoffStatus(profileId) {
      return await request(`/api/v1/browser/handoff?profileId=${encodeURIComponent(profileId)}`)
    },

    async release(profileId, { force = false } = {}) {
      return await request('/api/v1/browser/stop', {
        method: 'POST',
        body: { profileId, ...(force ? { force: true } : {}) },
      })
    },
  }
}

export default createMoordeckProvider
