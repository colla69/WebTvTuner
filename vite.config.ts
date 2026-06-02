import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import https from 'node:https'
import http from 'node:http'

/**
 * Custom proxy plugin that handles streaming proxy requests with proper
 * redirect following, CORS headers, and error handling.
 */
function streamProxyPlugin(): Plugin {
  return {
    name: 'stream-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()

        let targetUrl: string | null = null
        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }

        if (req.url.startsWith('/api/rai-relinker/')) {
          const path = req.url.replace('/api/rai-relinker/', '/relinker/')
          targetUrl = `https://mediapolis.rai.it${path}`
          headers['Referer'] = 'https://www.raiplay.it/'
        } else if (req.url.startsWith('/api/mediaset-live/')) {
          const path = req.url.replace('/api/mediaset-live/', '/')
          targetUrl = `https://live02-seg.msf.cdn.mediaset.net${path}`
          headers['Referer'] = 'https://mediasetinfinity.mediaset.it/'
        }

        if (!targetUrl) return next()

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', '*')
          res.writeHead(204)
          res.end()
          return
        }

        const fetchUrl = (url: string, remainingRedirects: number) => {
          const parsedUrl = new URL(url)
          const client = parsedUrl.protocol === 'https:' ? https : http
          const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: { ...headers, Host: parsedUrl.hostname },
            rejectUnauthorized: false,
          }

          const proxyReq = client.request(options, (proxyRes) => {
            // Follow HTTP redirects
            if ((proxyRes.statusCode === 301 || proxyRes.statusCode === 302) && proxyRes.headers.location && remainingRedirects > 0) {
              const redirectUrl = proxyRes.headers.location.startsWith('http')
                ? proxyRes.headers.location
                : new URL(proxyRes.headers.location, url).href
              proxyRes.resume()
              fetchUrl(redirectUrl, remainingRedirects - 1)
              return
            }

            // Stream response back to client with CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', '*')
            if (proxyRes.headers['content-type']) {
              res.setHeader('Content-Type', proxyRes.headers['content-type'])
            }
            res.writeHead(proxyRes.statusCode || 502)
            proxyRes.pipe(res)
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
