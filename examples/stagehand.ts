/**
 * Attach Playwright / Stagehand to a Moordeck profile running in `cdp_compat`.
 */

import { createMoordeckProvider } from '../agent-browser-provider/moordeck-provider.mjs'

async function main() {
  const provider = createMoordeckProvider({
    baseUrl: process.env.MOORDECK_API_URL ?? 'http://127.0.0.1:9112',
    token: process.env.MOORDECK_TOKEN,
  })

  const session = await provider.acquire({ serialNumber: 1 })
  console.log('Connect Playwright / Stagehand cdpUrl:', session.wsEndpoint)
  console.log('Proxy egress URL:', session.proxyUrl)
}

void main()
