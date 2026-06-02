---
name: embedding-adapters
description: 'Reference for building embedding adapters in WebTvTuner. Use when implementing, reviewing, or troubleshooting any adapter that embeds video from an external broadcaster website.'
---

# Embedding Adapters — WebTvTuner

This skill documents how to build, test, and maintain embedding adapters for the WebTvTuner project. Always read this before implementing or changing any adapter.

---

## Adapter Interface

Every adapter must implement the `EmbedAdapter` interface:

```typescript
interface EmbedAdapter {
  /** Unique adapter identifier (matches the domain) */
  id: string

  /** Human-readable name (e.g., "RAI Play") */
  name: string

  /** Domain pattern this adapter handles (e.g., "raiplay.it") */
  domain: string

  /**
   * Given a channel URL, return the embed configuration.
   * Must be a pure function — same URL always returns same config.
   */
  getEmbedConfig(channelUrl: string): EmbedConfig
}
```

---

## EmbedConfig Types

```typescript
type EmbedConfig =
  | IframeEmbedConfig
  | HlsEmbedConfig
  | CustomEmbedConfig

interface IframeEmbedConfig {
  type: 'iframe'
  src: string                  // Full URL for iframe src
  sandbox?: string             // Sandbox attribute value
  allow?: string               // Allow attribute value (e.g., "autoplay; encrypted-media")
  referrerPolicy?: string      // Referrer policy for the iframe
}

interface HlsEmbedConfig {
  type: 'hls'
  streamUrl: string            // HLS .m3u8 manifest URL
  headers?: Record<string, string>  // Custom headers (if proxy needed)
}

interface CustomEmbedConfig {
  type: 'custom'
  component: string            // Vue component name to render
  props: Record<string, unknown>  // Props to pass to the component
}
```

---

## Adapter Registry

All adapters are registered in `src/adapters/index.ts`:

```typescript
import { raiplayAdapter } from './raiplay.adapter'
import { mediasetAdapter } from './mediaset.adapter'
import type { EmbedAdapter } from './adapter.types'

const adapters: EmbedAdapter[] = [
  raiplayAdapter,
  mediasetAdapter,
  // Add new adapters here
]

/**
 * Find the adapter for a given channel URL based on domain matching.
 */
export function getAdapterForUrl(url: string): EmbedAdapter | undefined {
  const hostname = new URL(url).hostname
  return adapters.find(a => hostname.includes(a.domain))
}
```

---

## Writing an Adapter — Step by Step

### 1. Create the adapter file

File: `src/adapters/[domain].adapter.ts`

```typescript
import type { EmbedAdapter, EmbedConfig } from './adapter.types'

export const exampleAdapter: EmbedAdapter = {
  id: 'example',
  name: 'Example TV',
  domain: 'example.com',

  getEmbedConfig(channelUrl: string): EmbedConfig {
    // Parse the channel URL to extract what's needed
    const url = new URL(channelUrl)
    const channelSlug = url.pathname.split('/').pop()

    // Return the embed config
    return {
      type: 'iframe',
      src: `https://example.com/embed/${channelSlug}`,
      sandbox: 'allow-scripts allow-same-origin',
      allow: 'autoplay; encrypted-media; fullscreen',
    }
  },
}
```

### 2. Register in index.ts

Add the import and push to the adapters array.

### 3. Write unit tests

File: `src/adapters/__tests__/[domain].adapter.spec.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { exampleAdapter } from '../example.adapter'

describe('exampleAdapter', () => {
  it('has correct metadata', () => {
    expect(exampleAdapter.id).toBe('example')
    expect(exampleAdapter.domain).toBe('example.com')
  })

  it('generates iframe config for valid channel URL', () => {
    const config = exampleAdapter.getEmbedConfig('https://example.com/live/channel1')
    expect(config.type).toBe('iframe')
    if (config.type === 'iframe') {
      expect(config.src).toBe('https://example.com/embed/channel1')
    }
  })

  it('handles URL variations', () => {
    // Test with trailing slash, query params, etc.
    const config = exampleAdapter.getEmbedConfig('https://example.com/live/channel1/')
    expect(config.type).toBe('iframe')
  })
})
```

---

## Known Embedding Patterns

### Pattern 1: Direct iframe (simplest)

Some sites provide an embed-friendly URL. Just transform the page URL to the embed URL.

```typescript
// Page: https://example.com/live/channel1
// Embed: https://example.com/embed/channel1
getEmbedConfig(url) {
  const slug = new URL(url).pathname.replace('/live/', '/embed/')
  return { type: 'iframe', src: `https://example.com${slug}` }
}
```

### Pattern 2: HLS stream extraction

Some sites expose the .m3u8 stream URL in their page source or through a known API endpoint.

```typescript
getEmbedConfig(url) {
  const channelId = extractChannelId(url)
  return {
    type: 'hls',
    streamUrl: `https://streams.example.com/live/${channelId}/playlist.m3u8`
  }
}
```

### Pattern 3: Embedded player widget

Some sites provide an official embed/widget endpoint.

```typescript
getEmbedConfig(url) {
  return {
    type: 'iframe',
    src: `https://example.com/widget/player?channel=${channelId}&autoplay=1`,
    allow: 'autoplay; encrypted-media; fullscreen'
  }
}
```

---

## Troubleshooting Guide

| Problem | Likely Cause | Solution |
|---|---|---|
| Iframe shows blank | X-Frame-Options DENY on source | Try HLS approach or proxy |
| Video doesn't autoplay | Missing `allow="autoplay"` | Add allow attribute |
| CORS error on HLS | Stream server blocks cross-origin | Need a CORS proxy or different approach |
| 403 on stream URL | Referrer check failing | Set referrerPolicy on iframe |
| Geo-blocked | IP-based restriction | Document as known limitation |
| Stream URL changes | Dynamic token in URL | May need a server-side resolver (future) |

---

## Security Considerations

- Always set `sandbox` on iframes: minimum `allow-scripts allow-same-origin`
- Never allow `allow-top-navigation` on embedded iframes
- Validate all URLs before rendering — ensure they match the expected domain
- If using HLS with a proxy: ensure the proxy only accepts requests for known stream domains
- Document any adapter that requires `allow-same-origin` and explain why

---

## Testing Expectations

Every adapter must have:
1. **Metadata test** — id, name, domain are correct
2. **Happy path** — valid URL produces correct EmbedConfig
3. **URL variations** — trailing slashes, query params, different paths
4. **Edge cases** — malformed URLs handled gracefully (return error config or throw)

---

## Maintenance

Broadcaster websites change their video delivery frequently. Document in each adapter file:
- Date last verified working
- How to test manually (open browser dev tools, check network tab)
- Known fragilities (token rotation, geo-checks, etc.)
