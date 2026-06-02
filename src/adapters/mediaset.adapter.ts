import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Adapter for mediasetinfinity.mediaset.it live streams.
 * Mediaset blocks iframe embedding via CSP: frame-ancestors 'self' *.mediaset.it *.mediaset.net
 * Falls back to opening the stream in a new tab.
 * Last verified: 2026-06-02
 */
export const mediasetAdapter: EmbedAdapter = {
  id: 'mediaset',
  name: 'Mediaset Infinity',
  domain: 'mediasetinfinity.mediaset.it',

  getEmbedConfig(channelUrl: string): EmbedConfig {
    try {
      const url = new URL(channelUrl)
      const pathSegments = url.pathname.split('/').filter(Boolean)
      const direttaIndex = pathSegments.indexOf('diretta')
      const channelPart = direttaIndex >= 0 ? pathSegments[direttaIndex + 1] : undefined

      if (!channelPart) {
        return { type: 'error', message: 'Invalid Mediaset channel URL: missing channel identifier' }
      }

      // Mediaset blocks iframe embedding (CSP frame-ancestors restriction)
      return {
        type: 'external',
        url: `https://mediasetinfinity.mediaset.it/diretta/${channelPart}`,
        message: 'Mediaset does not allow embedding. Click below to open in a new tab.',
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for Mediaset adapter' }
    }
  },
}
