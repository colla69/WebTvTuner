import { describe, it, expect } from 'vitest'
import { mediasetAdapter } from '../mediaset.adapter'

describe('mediasetAdapter', () => {
  it('has correct metadata', () => {
    expect(mediasetAdapter.id).toBe('mediaset')
    expect(mediasetAdapter.name).toBe('Mediaset Infinity')
    expect(mediasetAdapter.domain).toBe('mediasetinfinity.mediaset.it')
  })

  it('generates external config (cannot iframe due to CSP)', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/rete4_cR4')
    expect(config.type).toBe('external')
    if (config.type === 'external') {
      expect(config.url).toBe('https://mediasetinfinity.mediaset.it/diretta/rete4_cR4')
      expect(config.message).toContain('Mediaset')
    }
  })

  it('handles all Mediaset channel URLs', () => {
    const channelParts = ['rete4_cR4', 'canale5_cC5', 'italia1_cI1', 'iris_cKI', '_cTS', 'la5_cKA']
    for (const part of channelParts) {
      const config = mediasetAdapter.getEmbedConfig(`https://mediasetinfinity.mediaset.it/diretta/${part}`)
      expect(config.type).toBe('external')
      if (config.type === 'external') {
        expect(config.url).toBe(`https://mediasetinfinity.mediaset.it/diretta/${part}`)
      }
    }
  })

  it('handles URL with trailing slash', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/canale5_cC5/')
    expect(config.type).toBe('external')
    if (config.type === 'external') {
      expect(config.url).toBe('https://mediasetinfinity.mediaset.it/diretta/canale5_cC5')
    }
  })

  it('returns error for invalid URL', () => {
    const config = mediasetAdapter.getEmbedConfig('not-a-url')
    expect(config.type).toBe('error')
  })
})
