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
  /** Whether a key is configured at all - distinguishes "none set" from
   *  "set but rejected", which need very different advice. Resolved here
   *  rather than read from process.env at the call site, because env reads
   *  do not behave identically in every bundle. */
  hasKey: boolean
  /** Actionable reason for a rejection, when we have one worth showing. */
  error?: string
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
  // Bracket access on purpose. Next.js statically replaces `process.env.FOO`
  // in the server bundle at build time, which bakes in whatever the value was
  // during `next build` - for a self-hosted app that is the wrong answer the
  // moment a buyer changes the variable. Computed access is read at runtime.
  const key = process.env['JOBFLOW_LICENSE_KEY']
  if (!key) return { valid: false, tier: null, hasKey: false }

  if (isSignedLicense(key)) {
    const r = validateLicense(key)
    return { valid: r.valid, tier: r.tier, hasKey: true, error: r.error }
  }

  try {
    const cache = await createDataProvider().getLicenseCache()
    if (cache?.key === key) {
      if (cache.valid && Date.now() - cache.checkedAt < LICENSE_GRACE_MS) {
        return { valid: true, tier: cache.tier, hasKey: true }
      }
      return { valid: false, tier: null, hasKey: true, error: cache.error }
    }
  } catch {
    // Storage unavailable - treat as unlicensed rather than granting access.
  }

  return { valid: false, tier: null, hasKey: true }
}
