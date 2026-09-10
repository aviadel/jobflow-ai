import type { LicenseCache } from './db/types'
import { LICENSE_GRACE_MS, LICENSE_REVALIDATE_MS, type LicenseTier } from './license'

/**
 * What /api/license should do about a Lemon Squeezy key.
 *
 * Pulled out of the route handler so it can be tested directly. The distinction
 * that matters most is `activate` vs `validateOnly`: activation consumes one of
 * the buyer's limited slots, so it must only happen where we can remember doing
 * it. On ephemeral storage every cold start would claim another slot and lock a
 * paying customer out within days.
 */
export type LicenseAction =
  | { kind: 'cached'; valid: boolean; tier: LicenseTier | null }
  | { kind: 'validateInstance'; instanceId: string }
  | { kind: 'activate' }
  | { kind: 'validateOnly' }

export function decideLicenseCheck(opts: {
  cache: LicenseCache | null
  key: string
  now: number
  persistent: boolean
}): LicenseAction {
  const { cache, key, now, persistent } = opts
  const matches = cache?.key === key

  if (cache && matches && now - cache.checkedAt < LICENSE_REVALIDATE_MS) {
    return { kind: 'cached', valid: cache.valid, tier: cache.tier }
  }
  if (cache && matches && cache.instanceId) {
    return { kind: 'validateInstance', instanceId: cache.instanceId }
  }
  return persistent ? { kind: 'activate' } : { kind: 'validateOnly' }
}

/**
 * What to fall back on when Lemon Squeezy cannot be reached at all.
 * Returns null when there is nothing trustworthy to fall back on.
 *
 * Only reached on a genuine transport failure - LZ answers an invalid key with
 * a JSON body, which is a verdict and must never land here.
 */
export function decideOnUnreachable(opts: {
  cache: LicenseCache | null
  key: string
  now: number
}): { tier: LicenseTier | null } | null {
  const { cache, key, now } = opts
  if (
    cache &&
    cache.key === key &&
    cache.valid &&
    now - cache.checkedAt < LICENSE_GRACE_MS
  ) {
    return { tier: cache.tier }
  }
  return null
}
