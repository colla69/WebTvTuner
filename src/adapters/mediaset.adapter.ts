import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Adapter for mediasetinfinity.mediaset.it live streams.
 * Mediaset provides live stream pages via /diretta/ URLs.
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
      // URL pattern: /diretta/{channelSlug_code}
      const direttaIndex = pathSegments.indexOf('diretta')
      const channelPart = direttaIndex >= 0 ? pathSegments[direttaIndex + 1] : undefined

      if (!channelPart) {
        return { type: 'error', message: 'Invalid Mediaset channel URL: missing channel identifier' }
      }

      return {
        type: 'iframe',
        src: `https://mediasetinfinity.mediaset.it/diretta/${channelPart}`,
        allow: 'autoplay; encrypted-media; fullscreen',
        referrerPolicy: 'no-referrer-when-downgrade',
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for Mediaset adapter' }
    }
  },
}
