import { describe, it, expect } from 'vitest'
import { mediasetAdapter } from '../mediaset.adapter'

describe('mediasetAdapter', () => {
  it('has correct metadata', () => {
    expect(mediasetAdapter.id).toBe('mediaset')
    expect(mediasetAdapter.name).toBe('Mediaset Infinity')
    expect(mediasetAdapter.domain).toBe('mediasetinfinity.mediaset.it')
  })

  it('generates iframe config using Mediaset embedded player', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/rete4_cR4')
    expect(config.type).toBe('iframe')
    if (config.type === 'iframe') {
      expect(config.src).toBe('https://static3.mediasetplay.mediaset.it/player/index.html?autoplay=true&callSign=R4')
      expect(config.allow).toContain('autoplay')
    }
  })

  it('extracts correct callSign for all Mediaset channels', () => {
    const expected: Record<string, string> = {
      'rete4_cR4': 'R4',
      'canale5_cC5': 'C5',
      'italia1_cI1': 'I1',
      'iris_cKI': 'KI',
      '_cTS': 'TS',
      'la5_cKA': 'KA',
    }
    for (const [part, callSign] of Object.entries(expected)) {
      const config = mediasetAdapter.getEmbedConfig(`https://mediasetinfinity.mediaset.it/diretta/${part}`)
      expect(config.type).toBe('iframe')
      if (config.type === 'iframe') {
        expect(config.src).toBe(`https://static3.mediasetplay.mediaset.it/player/index.html?autoplay=true&callSign=${callSign}`)
      }
    }
  })

  it('handles URL with trailing slash', () => {
    const config = mediasetAdapter.getEmbedConfig('https://mediasetinfinity.mediaset.it/diretta/canale5_cC5/')
    expect(config.type).toBe('iframe')
    if (config.type === 'iframe') {
      expect(config.src).toContain('callSign=C5')
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
