import { describe, it, expect } from 'vitest'
import { mediasetAdapter } from '../mediaset.adapter'

describe('mediasetAdapter', () => {
  it('has correct metadata', () => {
    expect(mediasetAdapter.id).toBe('mediaset')
    expect(mediasetAdapter.name).toBe('Mediaset Infinity')
    expect(mediasetAdapter.domain).toBe('mediasetinfinity.mediaset.it')
  })

  it('generates HLS config with direct CDN URL', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/canale5_cC5')
    expect(config.type).toBe('hls')
    if (config.type === 'hls') {
      expect(config.streamUrl).toBe('https://live02-seg.msf.cdn.mediaset.net/live/ch-c5/c5-clr.isml/index.m3u8')
    }
  })

  it('extracts correct channel code for all Mediaset channels', () => {
    const expected: Record<string, string> = {
      'rete4_cR4': 'r4',
      'canale5_cC5': 'c5',
      'italia1_cI1': 'i1',
      'iris_cKI': 'ki',
      '_cTS': 'ts',
      'la5_cKA': 'ka',
    }
    for (const [part, code] of Object.entries(expected)) {
      const config = mediasetAdapter.getEmbedConfig(`https://mediasetinfinity.mediaset.it/diretta/${part}`)
      expect(config.type).toBe('hls')
      if (config.type === 'hls') {
        expect(config.streamUrl).toBe(`https://live02-seg.msf.cdn.mediaset.net/live/ch-${code}/${code}-clr.isml/index.m3u8`)
      }
    }
  })

  it('handles URL with trailing slash', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/canale5_cC5/')
    expect(config.type).toBe('hls')
    if (config.type === 'hls') {
      expect(config.streamUrl).toContain('ch-c5')
    }
  })

  it('returns error for URL without callSign pattern', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/nocallsign')
    expect(config.type).toBe('error')
  })

  it('returns error for invalid URL', () => {
    const config = mediasetAdapter.getEmbedConfig('not-a-url')
    expect(config.type).toBe('error')
  })
})
