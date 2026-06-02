/**
 * Lightweight stream proxy server for production Docker.
 * Handles /api/stream-proxy?url=<target>&referer=<referer>
 *
 * Fetches the target URL with proper headers (masking Origin, setting Referer)
 * so CDNs think traffic is legitimate. For m3u8 responses, rewrites relative
 * URLs to absolute so hls.js can route them back through this proxy.
 */
import http from 'node:http'
import https from 'node:https'
import { URL } from 'node:url'

const PORT = 3001

function getRefererForUrl(url) {
  if (url.includes('rai.it') || url.includes('raiplay') || (url.includes('akamaized.net') && url.includes('rai'))) {
    return 'https://www.raiplay.it/'
  }
  if (url.includes('mediaset')) {
    return 'https://mediasetinfinity.mediaset.it/'
  }
  return ''
}

function rewriteM3u8Urls(content, baseUrl) {
  return content.split('\n').map(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      if (!trimmed.startsWith('http')) {
        try { return new URL(trimmed, baseUrl).href } catch { /* leave as-is */ }
      }
    }
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

function fetchUrl(targetUrl, referer, res, remainingRedirects) {
  const parsedUrl = new URL(targetUrl)
  const client = parsedUrl.protocol === 'https:' ? https : http
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Host': parsedUrl.hostname,
  }
  if (referer) headers['Referer'] = referer

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'GET',
    headers,
    rejectUnauthorized: false,
  }

  const proxyReq = client.request(options, (proxyRes) => {
    if ((proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307) && proxyRes.headers.location && remainingRedirects > 0) {
      const redirectUrl = proxyRes.headers.location.startsWith('http')
        ? proxyRes.headers.location
        : new URL(proxyRes.headers.location, targetUrl).href
      proxyRes.resume()
      fetchUrl(redirectUrl, referer, res, remainingRedirects - 1)
      return
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    const contentType = proxyRes.headers['content-type'] || ''
    if (contentType) res.setHeader('Content-Type', contentType)

    const isM3u8 = contentType.includes('mpegurl') || contentType.includes('m3u8') || targetUrl.includes('.m3u8')

    if (isM3u8 && proxyRes.statusCode === 200) {
      const chunks = []
      proxyRes.on('data', (chunk) => chunks.push(chunk))
      proxyRes.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8')
        const rewritten = rewriteM3u8Urls(body, targetUrl)
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
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end(`Proxy error: ${err.message}`)
  })

  proxyReq.setTimeout(15000, () => {
    proxyReq.destroy()
    if (!res.headersSent) res.writeHead(504, { 'Content-Type': 'text/plain' })
    res.end('Proxy timeout')
  })

  proxyReq.end()
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.writeHead(204)
    res.end()
    return
  }

  const parsed = new URL(req.url, `http://localhost:${PORT}`)
  const targetUrl = parsed.searchParams.get('url')
  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' })
    res.end('Missing url parameter')
    return
  }

  const referer = parsed.searchParams.get('referer') || getRefererForUrl(targetUrl)
  fetchUrl(targetUrl, referer, res, 5)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[stream-proxy] listening on 127.0.0.1:${PORT}`)
})
