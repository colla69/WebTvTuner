import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Adapter for mediasetinfinity.mediaset.it live streams.
 * Uses Mediaset's own embeddable player (static3.mediasetplay.mediaset.it/player/)
 * which serves with Access-Control-Allow-Origin: * and no frame-blocking headers.
 *
 * The callSign is extracted from the channel URL suffix pattern: `_cXX` → callSign `XX`
 * e.g. canale5_cC5 → C5, rete4_cR4 → R4, italia1_cI1 → I1
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

      // Extract callSign from the `_cXX` suffix (e.g. "canale5_cC5" → "C5")
      const callSignMatch = channelPart.match(/_c([A-Za-z0-9]+)$/)
      if (!callSignMatch) {
        return { type: 'error', message: `Cannot extract callSign from channel: ${channelPart}` }
      }

      const callSign = callSignMatch[1]
      const embedUrl = `https://static3.mediasetplay.mediaset.it/player/index.html?autoplay=true&callSign=${callSign}`

      return {
        type: 'iframe',
        src: embedUrl,
        allow: 'autoplay; encrypted-media; fullscreen',
        referrerPolicy: 'no-referrer',
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for Mediaset adapter' }
    }
  },
}
