import { createDataProvider } from './db'
import {
  LICENSE_GRACE_MS,
  isSignedLicense,
  validateLicense,
  type LicenseTier,
} from './license'

export interface ResolvedLicense {
  valid: boolean
  tier: LicenseTier | null
}

/**
 * The effective license for this instance, covering both key types.
 *
 * Ed25519 keys verify locally. Lemon Squeezy keys are read from the cached
 * verdict only - `proxy.ts` refreshes that cache through /api/license before
 * any page renders, so this never makes a network call of its own.
 *
 * Kept out of license.ts so the middleware bundle stays free of the DB layer.
 */
export async function resolveLicense(): Promise<ResolvedLicense> {
  const key = process.env.JOBFLOW_LICENSE_KEY
  if (!key) return { valid: false, tier: null }

  if (isSignedLicense(key)) {
    const r = validateLicense(key)
    return { valid: r.valid, tier: r.tier }
  }

  try {
    const cache = await createDataProvider().getLicenseCache()
    if (
      cache?.key === key &&
      cache.valid &&
      Date.now() - cache.checkedAt < LICENSE_GRACE_MS
    ) {
      return { valid: true, tier: cache.tier }
    }
  } catch {
    // Storage unavailable - treat as unlicensed rather than granting access.
  }

  return { valid: false, tier: null }
}
