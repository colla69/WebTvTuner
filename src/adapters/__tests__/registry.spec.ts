import { describe, it, expect } from 'vitest'
import { getAdapterForUrl } from '../index'

describe('adapter registry', () => {
  it('resolves raiplay adapter for raiplay.it URLs', () => {
    const adapter = getAdapterForUrl('https://www.raiplay.it/dirette/rai1')
    expect(adapter).toBeDefined()
    expect(adapter!.id).toBe('raiplay')
  })

  it('resolves mediaset adapter for mediasetinfinity URLs', () => {
    const adapter = getAdapterForUrl('https://mediasetinfinity.mediaset.it/diretta/rete4_cR4')
    expect(adapter).toBeDefined()
    expect(adapter!.id).toBe('mediaset')
  })

  it('returns undefined for unknown domains', () => {
    const adapter = getAdapterForUrl('https://www.unknown.com/stream')
    expect(adapter).toBeUndefined()
  })

  it('returns undefined for invalid URLs', () => {
    const adapter = getAdapterForUrl('not-a-url')
    expect(adapter).toBeUndefined()
  })
})
