export interface MoordeckProviderAcquireOptions {
  profileId?: string
  serialNumber?: number
  headless?: boolean
  allowedDomains?: string[]
  traceNet?: boolean
}

export interface MoordeckProviderSession {
  profileId: string
  serialNumber: number
  wsEndpoint: string
  proxyUrl: string | null
  reused: boolean
}

export function createMoordeckProvider(options?: {
  baseUrl?: string
  token?: string
}): {
  acquire(opts?: MoordeckProviderAcquireOptions): Promise<MoordeckProviderSession>
  handoffStatus(profileId: string): Promise<unknown>
  release(profileId: string, opts?: { force?: boolean }): Promise<unknown>
}
