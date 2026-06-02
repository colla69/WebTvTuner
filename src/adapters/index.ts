import type { EmbedAdapter } from './adapter.types'
import { raiplayAdapter } from './raiplay.adapter'
import { mediasetAdapter } from './mediaset.adapter'

const adapters: EmbedAdapter[] = [
  raiplayAdapter,
  mediasetAdapter,
]

/**
 * Find the adapter that handles a given channel URL based on domain matching.
 */
export function getAdapterForUrl(url: string): EmbedAdapter | undefined {
  try {
    const hostname = new URL(url).hostname
    return adapters.find(a => hostname.includes(a.domain))
  } catch {
    return undefined
  }
}

export { adapters }
