import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Adapter for raiplay.it live streams.
 * RAI provides an iframe-embeddable player via their /dirette/ URLs.
 * Last verified: 2026-06-02
 */
export const raiplayAdapter: EmbedAdapter = {
  id: 'raiplay',
  name: 'RAI Play',
  domain: 'raiplay.it',

  getEmbedConfig(channelUrl: string): EmbedConfig {
    try {
      const url = new URL(channelUrl)
      const pathSegments = url.pathname.split('/').filter(Boolean)
      // URL pattern: /dirette/{channelSlug}
      const diretteIndex = pathSegments.indexOf('dirette')
      const channelSlug = diretteIndex >= 0 ? pathSegments[diretteIndex + 1] : undefined

      if (!channelSlug) {
        return { type: 'error', message: 'Invalid RAI channel URL: missing channel slug' }
      }

      return {
        type: 'iframe',
        src: `https://www.raiplay.it/dirette/${channelSlug}`,
        allow: 'autoplay; encrypted-media; fullscreen',
        referrerPolicy: 'no-referrer-when-downgrade',
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for RAI adapter' }
    }
  },
}
