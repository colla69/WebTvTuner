import { describe, it, expect } from 'vitest'
import { raiplayAdapter } from '../raiplay.adapter'

describe('raiplayAdapter', () => {
  it('has correct metadata', () => {
    expect(raiplayAdapter.id).toBe('raiplay')
    expect(raiplayAdapter.name).toBe('RAI Play')
    expect(raiplayAdapter.domain).toBe('raiplay.it')
  })

  it('generates HLS config with proxied relinker URL', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/rai1')
    expect(config.type).toBe('hls')
    if (config.type === 'hls') {
      expect(config.streamUrl).toBe('/api/rai-relinker/relinkerServlet.htm?cont=2606803&output=20')
    }
  })

  it('handles all RAI channel URLs with correct content IDs', () => {
    const expected: Record<string, string> = {
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
    for (const [slug, contId] of Object.entries(expected)) {
      const config = raiplayAdapter.getEmbedConfig(`https://www.raiplay.it/dirette/${slug}`)
      expect(config.type).toBe('hls')
      if (config.type === 'hls') {
        expect(config.streamUrl).toContain(`cont=${contId}`)
        expect(config.streamUrl).toContain('output=20')
      }
    }
  })

  it('handles URL with trailing slash', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/rai1/')
    expect(config.type).toBe('hls')
    if (config.type === 'hls') {
      expect(config.streamUrl).toContain('cont=2606803')
    }
  })

  it('returns error for unknown channel slug', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/unknownchannel')
    expect(config.type).toBe('error')
  })

  it('returns error for invalid URL', () => {
    const config = raiplayAdapter.getEmbedConfig('not-a-url')
    expect(config.type).toBe('error')
  })

  it('returns error for URL with no channel slug', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/')
    expect(config.type).toBe('error')
  })
})
