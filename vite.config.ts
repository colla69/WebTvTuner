import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import https from 'node:https'
import http from 'node:http'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import type { Agent } from 'node:http'

/**
 * Creates a proxy agent if STREAM_PROXY env var is set.
 * Supports: http://host:port, https://host:port, socks5://host:port, socks4://host:port
 */
function createProxyAgent(): Agent | undefined {
  const proxyUrl = process.env.STREAM_PROXY
  if (!proxyUrl) return undefined
  if (proxyUrl.startsWith('socks')) {
    return new SocksProxyAgent(proxyUrl) as unknown as Agent
  }
  return new HttpsProxyAgent(proxyUrl) as unknown as Agent
}

/**
 * Determines the appropriate Referer header based on the target URL domain.
 */
function getRefererForUrl(url: string): string {
  if (url.includes('rai.it') || url.includes('raiplay') || (url.includes('akamaized.net') && url.includes('rai'))) {
    return 'https://www.raiplay.it/'
  }
  if (url.includes('mediaset')) {
    return 'https://mediasetinfinity.mediaset.it/'
  }
  return ''
}

/**
 * Rewrites relative URLs in an m3u8 playlist to absolute URLs so hls.js
 * can fetch them through the proxy without broken relative resolution.
 */
function rewriteM3u8Urls(content: string, baseUrl: string): string {
  return content.split('\n').map(line => {
    const trimmed = line.trim()
    // Segment/playlist URI lines (non-comment, non-empty)
    if (trimmed && !trimmed.startsWith('#')) {
      if (!trimmed.startsWith('http')) {
        try { return new URL(trimmed, baseUrl).href } catch { /* leave as-is */ }
      }
    }
    // Handle URI= attributes in EXT-X-MAP, EXT-X-KEY, EXT-X-MEDIA, etc.
    if (trimmed.includes('URI="')) {
      return trimmed.replace(/URI="([^"]+)"/g, (_match, uri) => {
        if (!uri.startsWith('http')) {
          try { return `URI="${new URL(uri, baseUrl).href}"` } catch { /* leave as-is */ }
        }
        return `URI="${uri}"`
      })
    }
    return line
  }).join('\n')
}

/**
 * Custom proxy plugin that handles:
 * - /api/rai-relinker/  → RAI relinker (returns plain-text CDN URL)
 * - /api/stream-proxy?url=<encoded>&referer=<encoded> → Generic stream proxy
 *
 * The stream proxy fetches any URL with proper headers, making CDN think
 * requests come from the original site. For m3u8 responses it rewrites
 * relative URLs to absolute so hls.js xhrSetup can proxy them too.
 */
function streamProxyPlugin(): Plugin {
  return {
    name: 'stream-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()

        // Handle CORS preflight for any /api/ route
        if (req.method === 'OPTIONS' && req.url.startsWith('/api/')) {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', '*')
          res.writeHead(204)
          res.end()
          return
        }

        let targetUrl: string | null = null
        let referer = ''

        if (req.url.startsWith('/api/rai-relinker/')) {
          const path = req.url.replace('/api/rai-relinker/', '/relinker/')
          targetUrl = `https://mediapolis.rai.it${path}`
          referer = 'https://www.raiplay.it/'
        } else if (req.url.startsWith('/api/stream-proxy')) {
          const parsed = new URL(req.url, 'http://localhost')
          const urlParam = parsed.searchParams.get('url')
          if (!urlParam) {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Missing url parameter')
            return
          }
          targetUrl = urlParam
          referer = parsed.searchParams.get('referer') || getRefererForUrl(urlParam)
        }

        if (!targetUrl) return next()

        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
        if (referer) headers['Referer'] = referer

        const agent = createProxyAgent()

        const fetchUrl = (url: string, remainingRedirects: number) => {
          const parsedUrl = new URL(url)
          const client = parsedUrl.protocol === 'https:' ? https : http
          const options: Record<string, unknown> = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: { ...headers, Host: parsedUrl.hostname },
            rejectUnauthorized: false,
          }
          if (agent) options.agent = agent

          const proxyReq = client.request(options, (proxyRes) => {
            if ((proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307) && proxyRes.headers.location && remainingRedirects > 0) {
              const redirectUrl = proxyRes.headers.location.startsWith('http')
                ? proxyRes.headers.location
                : new URL(proxyRes.headers.location, url).href
              proxyRes.resume()
              fetchUrl(redirectUrl, remainingRedirects - 1)
              return
            }

            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', '*')

            const contentType = proxyRes.headers['content-type'] || ''
            if (contentType) res.setHeader('Content-Type', contentType)

            const isM3u8 = contentType.includes('mpegurl') || contentType.includes('m3u8') || url.includes('.m3u8')

            if (isM3u8 && proxyRes.statusCode === 200) {
              // Buffer m3u8 to rewrite relative URLs
              const chunks: Buffer[] = []
              proxyRes.on('data', (chunk) => chunks.push(chunk))
              proxyRes.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf-8')
                const rewritten = rewriteM3u8Urls(body, url)
                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
                res.writeHead(200)
                res.end(rewritten)
              })
            } else {
              res.writeHead(proxyRes.statusCode || 502)
              proxyRes.pipe(res)
            }
          })

          proxyReq.on('error', (err) => {
            console.error('[stream-proxy] Error:', err.message)
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'text/plain' })
            }
            res.end(`Proxy error: ${err.message}`)
          })

          proxyReq.setTimeout(15000, () => {
            proxyReq.destroy()
            if (!res.headersSent) {
              res.writeHead(504, { 'Content-Type': 'text/plain' })
            }
            res.end('Proxy timeout')
          })

          proxyReq.end()
        }

        fetchUrl(targetUrl, 5)
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), streamProxyPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
