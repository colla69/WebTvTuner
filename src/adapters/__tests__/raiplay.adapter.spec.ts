import { describe, it, expect } from 'vitest'
import { raiplayAdapter } from '../raiplay.adapter'

describe('raiplayAdapter', () => {
  it('has correct metadata', () => {
    expect(raiplayAdapter.id).toBe('raiplay')
    expect(raiplayAdapter.name).toBe('RAI Play')
    expect(raiplayAdapter.domain).toBe('raiplay.it')
  })

  it('generates iframe config using dedicated embed URL', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/rai1')
    expect(config.type).toBe('iframe')
    if (config.type === 'iframe') {
      expect(config.src).toBe('https://www.raiplay.it/iframe/dirette/rai1')
      expect(config.allow).toContain('autoplay')
    }
  })

  it('handles all RAI channel URLs', () => {
    const channels = ['rai1', 'rai2', 'rai3', 'rai4', 'rai5', 'raimovie', 'raipremium', 'raigulp', 'raiyoyo']
    for (const slug of channels) {
      const config = raiplayAdapter.getEmbedConfig(`https://www.raiplay.it/dirette/${slug}`)
      expect(config.type).toBe('iframe')
      if (config.type === 'iframe') {
        expect(config.src).toBe(`https://www.raiplay.it/iframe/dirette/${slug}`)
      }
    }
  })

  it('handles URL with trailing slash', () => {
    const config = raiplayAdapter.getEmbedConfig('https://www.raiplay.it/dirette/rai1/')
    expect(config.type).toBe('iframe')
    if (config.type === 'iframe') {
      expect(config.src).toBe('https://www.raiplay.it/iframe/dirette/rai1')
    }
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
