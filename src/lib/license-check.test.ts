import { describe, expect, it } from 'vitest'
import { decideLicenseCheck, decideOnUnreachable } from './license-check'
import type { LicenseCache } from './db/types'

const DAY = 86_400_000
const NOW = 1_780_000_000_000
const KEY = 'LZ-KEY-1'

function cache(over: Partial<LicenseCache> = {}): LicenseCache {
  return {
    key: KEY,
    instanceId: 'inst-1',
    valid: true,
    tier: 'professional',
    checkedAt: NOW - DAY,
    ...over,
  }
}

describe('decideLicenseCheck - caching', () => {
  it('trusts a fresh cache without contacting LZ', () => {
    const a = decideLicenseCheck({ cache: cache(), key: KEY, now: NOW, persistent: true })
    expect(a).toEqual({ kind: 'cached', valid: true, tier: 'professional' })
  })

  it('caches a negative verdict too, so a bad key is not re-checked every request', () => {
    const a = decideLicenseCheck({
      cache: cache({ valid: false, tier: null }),
      key: KEY,
      now: NOW,
      persistent: true,
    })
    expect(a).toEqual({ kind: 'cached', valid: false, tier: null })
  })

  it('re-checks once the cache passes 7 days, without consuming a slot', () => {
    const a = decideLicenseCheck({
      cache: cache({ checkedAt: NOW - 8 * DAY }),
      key: KEY,
      now: NOW,
      persistent: true,
    })
    expect(a).toEqual({ kind: 'validateInstance', instanceId: 'inst-1' })
  })

  it('ignores a cache belonging to a different key', () => {
    const a = decideLicenseCheck({
      cache: cache({ key: 'SOME-OTHER-KEY' }),
      key: KEY,
      now: NOW,
      persistent: true,
    })
    expect(a.kind).toBe('activate')
  })
})

describe('decideLicenseCheck - activation slots', () => {
  it('activates on first sight when storage persists', () => {
    const a = decideLicenseCheck({ cache: null, key: KEY, now: NOW, persistent: true })
    expect(a).toEqual({ kind: 'activate' })
  })

  it('never activates on ephemeral storage', () => {
    // The bug this suite exists for: /tmp is wiped on every Vercel cold start,
    // so activating here burned a slot each time until the buyer was locked out.
    const a = decideLicenseCheck({ cache: null, key: KEY, now: NOW, persistent: false })
    expect(a).toEqual({ kind: 'validateOnly' })
  })

  it('burns zero slots across 50 cold starts on ephemeral storage', () => {
    const actions = Array.from({ length: 50 }, () =>
      decideLicenseCheck({ cache: null, key: KEY, now: NOW, persistent: false }),
    )
    expect(actions.filter((a) => a.kind === 'activate')).toHaveLength(0)
  })

  it('burns exactly one slot across 50 requests once the cache persists', () => {
    let stored: LicenseCache | null = null
    let activations = 0

    for (let i = 0; i < 50; i++) {
      const a = decideLicenseCheck({
        cache: stored,
        key: KEY,
        now: NOW + i * 1000,
        persistent: true,
      })
      if (a.kind === 'activate') {
        activations++
        stored = cache({ checkedAt: NOW + i * 1000 })
      }
    }

    expect(activations).toBe(1)
  })

  it('does not re-activate when a stale cache still has an instance id', () => {
    const a = decideLicenseCheck({
      cache: cache({ checkedAt: NOW - 100 * DAY }),
      key: KEY,
      now: NOW,
      persistent: true,
    })
    expect(a.kind).toBe('validateInstance')
  })

  it('activates when a matching cache somehow lost its instance id', () => {
    const a = decideLicenseCheck({
      cache: cache({ instanceId: null, checkedAt: NOW - 8 * DAY }),
      key: KEY,
      now: NOW,
      persistent: true,
    })
    expect(a.kind).toBe('activate')
  })
})

describe('decideOnUnreachable - outage grace period', () => {
  it('keeps a paying customer working when LZ is down', () => {
    expect(decideOnUnreachable({ cache: cache(), key: KEY, now: NOW })).toEqual({
      tier: 'professional',
    })
  })

  it('still honours a cache well past the 7-day revalidation point', () => {
    const r = decideOnUnreachable({ cache: cache({ checkedAt: NOW - 20 * DAY }), key: KEY, now: NOW })
    expect(r).toEqual({ tier: 'professional' })
  })

  it('stops honouring it after 30 days', () => {
    expect(
      decideOnUnreachable({ cache: cache({ checkedAt: NOW - 31 * DAY }), key: KEY, now: NOW }),
    ).toBeNull()
  })

  it('never revives a key that was cached as invalid', () => {
    expect(
      decideOnUnreachable({ cache: cache({ valid: false }), key: KEY, now: NOW }),
    ).toBeNull()
  })

  it('grants nothing when there is no cache at all', () => {
    expect(decideOnUnreachable({ cache: null, key: KEY, now: NOW })).toBeNull()
  })

  it('grants nothing for a cache belonging to another key', () => {
    expect(
      decideOnUnreachable({ cache: cache({ key: 'OTHER' }), key: KEY, now: NOW }),
    ).toBeNull()
  })
})
