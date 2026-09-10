import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { createDataProvider } from '@/lib/db'
import {
  ACTIVATION_LIMIT_MESSAGE,
  LICENSE_GRACE_MS,
  LICENSE_REVALIDATE_MS,
  activateLemonLicense,
  isActivationLimitError,
  isSignedLicense,
  storageIsPersistent,
  validateLemonLicense,
  validateLicense,
} from '@/lib/license'
import type { LicenseCache } from '@/lib/db/types'

function validateSecret(req: NextRequest): boolean {
  const secret = process.env.TRIAL_SECRET
  if (!secret) return false
  const provided = req.headers.get('x-internal-secret')
  if (!provided) return false
  const expected = createHmac('sha256', secret).update('trial-internal').digest('hex')
  try {
    const providedBuf = Buffer.from(provided, 'hex')
    const expectedBuf = Buffer.from(expected, 'hex')
    if (providedBuf.length !== expectedBuf.length) return false
    return timingSafeEqual(providedBuf, expectedBuf)
  } catch {
    return false
  }
}

function verdict(valid: boolean, tier: string | null, source: string, error?: string) {
  return Response.json({ valid, tier, source, ...(error ? { error } : {}) })
}

export async function GET(req: NextRequest) {
  if (!validateSecret(req)) return new Response('Forbidden', { status: 403 })

  const key = process.env.JOBFLOW_LICENSE_KEY
  if (!key) return verdict(false, null, 'none', 'No license key set')

  // Our own Ed25519 keys verify locally - no network, no cache needed.
  if (isSignedLicense(key)) {
    const r = validateLicense(key)
    return verdict(r.valid, r.tier, 'signed', r.error)
  }

  const db = createDataProvider()
  const now = Date.now()

  let cache: LicenseCache | null = null
  try {
    cache = await db.getLicenseCache()
  } catch {
    // Storage unavailable - fall through and ask LZ directly.
  }

  const cacheMatchesKey = cache?.key === key

  // Fresh cache wins outright.
  if (cache && cacheMatchesKey && now - cache.checkedAt < LICENSE_REVALIDATE_MS) {
    return verdict(cache.valid, cache.tier, 'cache')
  }

  // Stale, missing, or for a different key - ask LZ.
  try {
    let result
    if (cacheMatchesKey && cache?.instanceId) {
      // Already activated on this instance - re-check without consuming a slot.
      result = await validateLemonLicense(key, cache.instanceId)
    } else if (storageIsPersistent()) {
      // First sight of this key and we can remember the outcome, so claim an
      // activation slot. This is what makes the per-product activation limit
      // actually enforce anything.
      result = await activateLemonLicense(key, new URL(req.url).host)
    } else {
      // Ephemeral storage (DATA_PROVIDER=json): /tmp is wiped on every cold
      // start, so activating here would burn a fresh slot each time and lock
      // the buyer out within days. Validate only - weaker sharing enforcement,
      // but it never bricks a paying customer.
      result = await validateLemonLicense(key, null)
    }

    // Replace LZ's terse wording with something the buyer can act on. Cached
    // alongside the verdict so /setup can show it instead of a bare failure.
    const error = isActivationLimitError(result.error)
      ? ACTIVATION_LIMIT_MESSAGE
      : result.error

    try {
      await db.setLicenseCache({
        key,
        instanceId: result.instanceId,
        valid: result.valid,
        tier: result.tier,
        checkedAt: now,
        ...(error ? { error } : {}),
      })
    } catch {
      // Verdict is still good even if we could not persist it.
    }

    return verdict(result.valid, result.tier, 'lemonsqueezy', error)
  } catch {
    // LZ unreachable. Honour a previously-good verdict rather than locking out
    // a paying customer because someone else's API is down.
    if (cache && cacheMatchesKey && cache.valid && now - cache.checkedAt < LICENSE_GRACE_MS) {
      return verdict(true, cache.tier, 'grace')
    }
    return verdict(false, null, 'unreachable', 'Could not reach the license server')
  }
}
