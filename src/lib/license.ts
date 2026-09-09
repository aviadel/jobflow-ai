import { createHmac, timingSafeEqual } from 'crypto'

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

function b64urlDecode(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (b64.length % 4)) % 4
  return Buffer.from(b64 + '='.repeat(pad), 'base64').toString('utf-8')
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

  const secret = process.env.LICENSE_SIGNING_SECRET
  if (!secret) {
    return { valid: false, tier: null, issued: null, error: 'LICENSE_SIGNING_SECRET not configured' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return { valid: false, tier: null, issued: null, error: 'Invalid token format' }
  }

  const [headerB64, payloadB64, sigB64] = parts
  const signingInput = `${headerB64}.${payloadB64}`

  const expected = createHmac('sha256', secret).update(signingInput).digest()
  const received = b64urlDecodeBuffer(sigB64)

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
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
 * same secret used in proxy.ts (LICENSE_SIGNING_SECRET ?? fallback).
 */
export function parseTrialCookie(
  value: string | undefined,
  secret: string,
): { daysLeft: number } | null {
  if (!value) return null
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

/** Generates a signed JWT for a given tier. Used by the license key generator script. */
export function signLicense(tier: LicenseTier, email?: string): string {
  const secret = process.env.LICENSE_SIGNING_SECRET
  if (!secret) throw new Error('LICENSE_SIGNING_SECRET not set')

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({ tier, issued: new Date().toISOString().slice(0, 10), ...(email ? { email } : {}) }),
  ).toString('base64url')

  const sig = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')

  return `${header}.${payload}.${sig}`
}
