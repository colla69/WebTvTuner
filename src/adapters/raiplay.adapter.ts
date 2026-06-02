import type { EmbedAdapter, EmbedConfig } from './adapter.types'

/**
 * Channel slug → relinker content ID mapping.
 * These are the RAI "cont" parameter values for HLS streaming (output=20).
 * Source: https://www.raiplay.it/dirette/{slug}.json → video.content_url
 */
const RAI_CONTENT_IDS: Record<string, string> = {
  rai1: '2606803',
  rai2: '308718',
  rai3: '308709',
  rai4: '746966',
  rai5: '395276',
  raimovie: '747002',
  raipremium: '746992',
  raigulp: '746953',
  raiyoyo: '746899',
}

/**
 * Adapter for raiplay.it live streams.
 * Uses the RAI relinker endpoint which returns an HLS stream when output=20.
 * Requests are proxied through /api/rai-relinker/ in nginx to handle CORS.
 */
export const raiplayAdapter: EmbedAdapter = {
  id: 'raiplay',
  name: 'RAI Play',
  domain: 'raiplay.it',

  getEmbedConfig(channelUrl: string): EmbedConfig {
    try {
      const url = new URL(channelUrl)
      const pathSegments = url.pathname.split('/').filter(Boolean)
      const diretteIndex = pathSegments.indexOf('dirette')
      const channelSlug = diretteIndex >= 0 ? pathSegments[diretteIndex + 1] : undefined

      if (!channelSlug) {
        return { type: 'error', message: 'Invalid RAI channel URL: missing channel slug' }
      }

      const contId = RAI_CONTENT_IDS[channelSlug]
      if (!contId) {
        return { type: 'error', message: `Unknown RAI channel: ${channelSlug}` }
      }

      return {
        type: 'hls',
        streamUrl: `/api/rai-relinker/relinkerServlet.htm?cont=${contId}&output=20`,
      }
    } catch {
      return { type: 'error', message: 'Invalid URL format for RAI adapter' }
    }
  },
}
