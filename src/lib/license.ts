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
