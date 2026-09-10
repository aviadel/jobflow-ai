import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { createDataProvider } from '@/lib/db'
import {
  ACTIVATION_LIMIT_MESSAGE,
  activateLemonLicense,
  isActivationLimitError,
  isSignedLicense,
  storageIsPersistent,
  validateLemonLicense,
  validateLicense,
} from '@/lib/license'
import { decideLicenseCheck, decideOnUnreachable } from '@/lib/license-check'
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

  const action = decideLicenseCheck({
    cache,
    key,
    now,
    persistent: storageIsPersistent(),
  })

  if (action.kind === 'cached') {
    return verdict(action.valid, action.tier, 'cache')
  }

  try {
    const result =
      action.kind === 'validateInstance'
        ? await validateLemonLicense(key, action.instanceId)
        : action.kind === 'activate'
          ? await activateLemonLicense(key, new URL(req.url).host)
          : await validateLemonLicense(key, null)

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
    const fallback = decideOnUnreachable({ cache, key, now })
    if (fallback) return verdict(true, fallback.tier, 'grace')
    return verdict(false, null, 'unreachable', 'Could not reach the license server')
  }
}
