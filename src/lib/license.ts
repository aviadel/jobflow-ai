import { createHmac, createPublicKey, timingSafeEqual, verify } from 'crypto'

export type LicenseTier = 'starter' | 'professional' | 'lifetime'

export interface LicenseResult {
  valid: boolean
  tier: LicenseTier | null
  issued: string | null
  error?: string
}

interface LicensePayload {
  tier: LicenseTier
  issued: string
  email?: string
}

// Ed25519 public key. Verification only - it cannot create licenses.
// The matching private key is held by the developer and never ships.
const LICENSE_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAVszt9VnLTzFHU/kImbr0juaY0rXA3K13GA9DzRBtRTo=
-----END PUBLIC KEY-----`

function b64urlDecode(str: string): string {
  return b64urlDecodeBuffer(str).toString('utf-8')
}

function b64urlDecodeBuffer(str: string): Buffer {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (b64.length % 4)) % 4
  return Buffer.from(b64 + '='.repeat(pad), 'base64')
}

const VALID_TIERS: LicenseTier[] = ['starter', 'professional', 'lifetime']

export function validateLicense(token: string | undefined): LicenseResult {
  if (!token) {
    return { valid: false, tier: null, issued: null, error: 'No license key provided' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return { valid: false, tier: null, issued: null, error: 'Invalid token format' }
  }

  const [headerB64, payloadB64, sigB64] = parts

  let signatureOk = false
  try {
    signatureOk = verify(
      null,
      Buffer.from(`${headerB64}.${payloadB64}`),
      createPublicKey(LICENSE_PUBLIC_KEY_PEM),
      b64urlDecodeBuffer(sigB64),
    )
  } catch {
    return { valid: false, tier: null, issued: null, error: 'Invalid signature' }
  }

  if (!signatureOk) {
    return { valid: false, tier: null, issued: null, error: 'Invalid signature' }
  }

  let payload: LicensePayload
  try {
    payload = JSON.parse(b64urlDecode(payloadB64)) as LicensePayload
  } catch {
    return { valid: false, tier: null, issued: null, error: 'Malformed payload' }
  }

  if (!VALID_TIERS.includes(payload.tier)) {
    return { valid: false, tier: null, issued: null, error: `Unknown tier "${payload.tier}"` }
  }

  return { valid: true, tier: payload.tier, issued: payload.issued ?? null }
}

// ── Lemon Squeezy license keys ────────────────────────────────────────────────
// Keys issued by LZ on purchase are opaque UUID-style strings, not signed
// tokens, so they can only be checked by asking LZ. Callers are expected to
// cache the verdict (see /api/license) — never call this per request.

const LZ_API = 'https://api.lemonsqueezy.com/v1/licenses'

/** How long a cached verdict is trusted before we re-check with LZ. */
export const LICENSE_REVALIDATE_MS = 7 * 86_400_000
/** How long a cached verdict still counts if LZ cannot be reached at all. */
export const LICENSE_GRACE_MS = 30 * 86_400_000

/** Any key containing two dots is one of our own signed tokens. */
export function isSignedLicense(token: string): boolean {
  return token.split('.').length === 3
}

/** Storage backends that survive a server restart. Activation consumes one of
 *  the buyer's limited slots, so it is only safe where we can remember having
 *  done it - on ephemeral storage every cold start would burn another slot. */
const PERSISTENT_PROVIDERS = new Set(['postgres', 'sheets'])

export function storageIsPersistent(): boolean {
  return PERSISTENT_PROVIDERS.has(process.env.DATA_PROVIDER ?? 'json')
}

/** True when LZ refused an activation because the key is already on the
 *  maximum number of machines, as opposed to the key being bad. */
export function isActivationLimitError(error: string | undefined): boolean {
  return /activation limit|too many|limit reached/i.test(error ?? '')
}

export const ACTIVATION_LIMIT_MESSAGE =
  'This license key has reached its activation limit. Open your Lemon Squeezy ' +
  'account, deactivate an instance you no longer use, then redeploy.'

/** Maps an LZ product name to a tier. Unrecognised names fall back to the
 *  lowest tier, so a renamed product can never silently grant Professional. */
function tierFromProductName(name: string | undefined): LicenseTier {
  const n = (name ?? '').toLowerCase()
  if (n.includes('lifetime')) return 'lifetime'
  if (n.includes('professional')) return 'professional'
  return 'starter'
}

interface LzResponse {
  valid?: boolean
  activated?: boolean
  error?: string | null
  license_key?: { status?: string }
  instance?: { id?: string } | null
  meta?: { product_name?: string }
}

async function lzPost(path: string, body: Record<string, string>): Promise<LzResponse> {
  const res = await fetch(`${LZ_API}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
    signal: AbortSignal.timeout(8000),
  })
  // LZ returns 400/404 with a JSON body for invalid keys - that is a verdict,
  // not a transport failure, so parse it rather than throwing.
  return await res.json() as LzResponse
}

export interface LzCheckResult {
  valid: boolean
  tier: LicenseTier | null
  instanceId: string | null
  error?: string
}

/**
 * Activates a license key against LZ, claiming one activation slot.
 * Used the first time an instance sees a given key.
 */
export async function activateLemonLicense(
  key: string,
  instanceName: string,
): Promise<LzCheckResult> {
  const data = await lzPost('/activate', { license_key: key, instance_name: instanceName })
  if (!data.activated) {
    return { valid: false, tier: null, instanceId: null, error: data.error ?? 'Activation failed' }
  }
  return {
    valid: true,
    tier: tierFromProductName(data.meta?.product_name),
    instanceId: data.instance?.id ?? null,
  }
}

/** Re-checks an already-activated key. */
export async function validateLemonLicense(
  key: string,
  instanceId: string | null,
): Promise<LzCheckResult> {
  const data = await lzPost('/validate', {
    license_key: key,
    ...(instanceId ? { instance_id: instanceId } : {}),
  })
  if (!data.valid) {
    return { valid: false, tier: null, instanceId, error: data.error ?? 'Invalid license key' }
  }
  return {
    valid: true,
    tier: tierFromProductName(data.meta?.product_name),
    instanceId,
  }
}

export const TRIAL_DAYS = 7
export const TRIAL_COOKIE = 'jf_trial'

/**
 * Returns how many full days are left in the trial, or null if the cookie is
 * absent / tampered / already expired. Pass the raw cookie value and the
 * instance's TRIAL_SECRET.
 */
export function parseTrialCookie(
  value: string | undefined,
  secret: string,
): { daysLeft: number } | null {
  if (!value || !secret) return null
  const dot = value.indexOf('.')
  if (dot === -1) return null
  const ts = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  const expectedBuf = createHmac('sha256', secret).update(ts).digest()
  let sigBuf: Buffer
  try { sigBuf = Buffer.from(sig, 'hex') } catch { return null }
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null
  const startedAt = parseInt(ts, 10)
  if (isNaN(startedAt) || startedAt <= 0) return null
  const daysLeft = Math.max(0, TRIAL_DAYS - Math.floor((Date.now() - startedAt) / 86_400_000))
  return daysLeft > 0 ? { daysLeft } : null
}
