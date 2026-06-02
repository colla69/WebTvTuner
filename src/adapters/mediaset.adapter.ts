import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Mediaset live HLS stream URL pattern:
 * https://live02-seg.msf.cdn.mediaset.net/live/ch-{code}/{code}-clr.isml/index.m3u8
 *
 * The channel code is the lowercase callSign extracted from the URL suffix (_cXX → xx).
 * We give the CDN URL directly to hls.js so the BROWSER fetches it (routes through
 * the user's VPN). Falls back to proxy if CORS blocks direct access.
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

      const code = callSignMatch[1].toLowerCase()

      return {
        type: 'hls',
        streamUrl: `https://live02-seg.msf.cdn.mediaset.net/live/ch-${code}/${code}-clr.isml/index.m3u8`,
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for Mediaset adapter' }
    }
  },
}
