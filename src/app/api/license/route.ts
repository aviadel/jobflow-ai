import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { createDataProvider } from '@/lib/db'
import {
  LICENSE_GRACE_MS,
  LICENSE_REVALIDATE_MS,
  activateLemonLicense,
  isSignedLicense,
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
    const result = cacheMatchesKey && cache?.instanceId
      ? await validateLemonLicense(key, cache.instanceId)
      : await activateLemonLicense(key, new URL(req.url).host)

    try {
      await db.setLicenseCache({
        key,
        instanceId: result.instanceId,
        valid: result.valid,
        tier: result.tier,
        checkedAt: now,
      })
    } catch {
      // Verdict is still good even if we could not persist it.
    }

    return verdict(result.valid, result.tier, 'lemonsqueezy', result.error)
  } catch {
    // LZ unreachable. Honour a previously-good verdict rather than locking out
    // a paying customer because someone else's API is down.
    if (cache && cacheMatchesKey && cache.valid && now - cache.checkedAt < LICENSE_GRACE_MS) {
      return verdict(true, cache.tier, 'grace')
    }
    return verdict(false, null, 'unreachable', 'Could not reach the license server')
  }
}
