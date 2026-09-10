import { describe, expect, it } from 'vitest'
import { generateKeyPairSync, sign } from 'crypto'
import {
  isActivationLimitError,
  isSignedLicense,
  storageIsPersistent,
  tierFromProductName,
  validateLicense,
  type LicenseTier,
} from './license'

// A throwaway keypair, generated per run. Deliberately NOT the production key:
// signing with the real one would put a working licence in the repo.
const { publicKey, privateKey } = generateKeyPairSync('ed25519')
const TEST_PUB = publicKey.export({ type: 'spki', format: 'pem' }).toString()

function b64u(o: unknown) {
  return Buffer.from(JSON.stringify(o)).toString('base64url')
}

function makeKey(payload: object, header: object = { alg: 'EdDSA', typ: 'JWT' }) {
  const h = b64u(header)
  const p = b64u(payload)
  const s = sign(null, Buffer.from(`${h}.${p}`), privateKey).toString('base64url')
  return `${h}.${p}.${s}`
}

describe('validateLicense - genuine keys', () => {
  it.each<LicenseTier>(['starter', 'professional', 'lifetime'])(
    'accepts a %s key and reports its tier',
    (tier) => {
      const r = validateLicense(makeKey({ tier, issued: '2026-09-10' }), TEST_PUB)
      expect(r.valid).toBe(true)
      expect(r.tier).toBe(tier)
    },
  )

  it('returns the issue date', () => {
    const r = validateLicense(makeKey({ tier: 'starter', issued: '2026-01-15' }), TEST_PUB)
    expect(r.issued).toBe('2026-01-15')
  })
})

describe('validateLicense - forgery and tampering', () => {
  it('rejects an upgraded tier (the attack the Ed25519 change closed)', () => {
    const real = makeKey({ tier: 'starter', issued: '2026-09-10' })
    const [h, , s] = real.split('.')
    const forged = `${h}.${b64u({ tier: 'lifetime', issued: '2026-09-10' })}.${s}`

    const r = validateLicense(forged, TEST_PUB)
    expect(r.valid).toBe(false)
    expect(r.tier).toBeNull()
  })

  it('rejects a key signed by a different keypair', () => {
    const attacker = generateKeyPairSync('ed25519')
    const h = b64u({ alg: 'EdDSA', typ: 'JWT' })
    const p = b64u({ tier: 'lifetime', issued: '2026-09-10' })
    const s = sign(null, Buffer.from(`${h}.${p}`), attacker.privateKey).toString('base64url')

    expect(validateLicense(`${h}.${p}.${s}`, TEST_PUB).valid).toBe(false)
  })

  it('rejects a valid key checked against the production public key', () => {
    // Guards the test seam: keys minted here must not work in production.
    expect(validateLicense(makeKey({ tier: 'lifetime', issued: '2026-09-10' })).valid).toBe(false)
  })

  it('rejects an unknown tier even when the signature is genuine', () => {
    const r = validateLicense(makeKey({ tier: 'enterprise', issued: '2026-09-10' }), TEST_PUB)
    expect(r.valid).toBe(false)
    expect(r.error).toMatch(/tier/i)
  })

  it('rejects a tampered signature', () => {
    const real = makeKey({ tier: 'starter', issued: '2026-09-10' })
    const [h, p, s] = real.split('.')
    // Alter a character mid-signature. The final base64url character carries
    // only leftover bits and can decode to the same bytes, so changing it is
    // not a reliable way to corrupt the signature.
    const i = Math.floor(s.length / 2)
    const flipped = s.slice(0, i) + (s[i] === 'A' ? 'B' : 'A') + s.slice(i + 1)
    expect(flipped).not.toBe(s)
    expect(validateLicense(`${h}.${p}.${flipped}`, TEST_PUB).valid).toBe(false)
  })
})

describe('validateLicense - malformed input', () => {
  it.each([
    ['undefined', undefined],
    ['empty string', ''],
    ['no dots', 'not-a-key'],
    ['two parts', 'aaa.bbb'],
    ['four parts', 'aaa.bbb.ccc.ddd'],
    ['an LZ-style uuid', '38B4F2A1-9C3D-4E5F-8A7B-1C2D3E4F5A6B'],
    ['garbage base64', '!!!.@@@.###'],
  ])('rejects %s without throwing', (_label, input) => {
    expect(() => validateLicense(input as string | undefined, TEST_PUB)).not.toThrow()
    expect(validateLicense(input as string | undefined, TEST_PUB).valid).toBe(false)
  })

  it('rejects a genuine signature over a non-JSON payload', () => {
    const h = b64u({ alg: 'EdDSA', typ: 'JWT' })
    const p = Buffer.from('not json at all').toString('base64url')
    const s = sign(null, Buffer.from(`${h}.${p}`), privateKey).toString('base64url')
    expect(validateLicense(`${h}.${p}.${s}`, TEST_PUB).valid).toBe(false)
  })
})

describe('isSignedLicense', () => {
  it('routes our own tokens to local verification', () => {
    expect(isSignedLicense(makeKey({ tier: 'starter', issued: '2026-09-10' }))).toBe(true)
  })

  it('routes Lemon Squeezy keys to the remote path', () => {
    expect(isSignedLicense('38B4F2A1-9C3D-4E5F-8A7B-1C2D3E4F5A6B')).toBe(false)
  })
})

describe('tierFromProductName', () => {
  it.each([
    ['JobFlow Professional', 'professional'],
    ['JobFlow Starter', 'starter'],
    ['JobFlow Lifetime', 'lifetime'],
    ['jobflow professional', 'professional'],
  ])('maps %s to %s', (name, tier) => {
    expect(tierFromProductName(name)).toBe(tier)
  })

  it.each([
    ['a renamed product', 'Something Else'],
    ['an empty name', ''],
    ['a missing name', undefined],
  ])('fails closed to starter for %s', (_label, name) => {
    // Never silently grant Professional when the product cannot be identified.
    expect(tierFromProductName(name)).toBe('starter')
  })
})

describe('storageIsPersistent', () => {
  it.each([
    ['postgres', true],
    ['sheets', true],
    ['json', false],
    [undefined, false],
    ['', false],
  ])('%s -> %s', (provider, expected) => {
    const prev = process.env.DATA_PROVIDER
    if (provider === undefined) delete process.env.DATA_PROVIDER
    else process.env.DATA_PROVIDER = provider
    expect(storageIsPersistent()).toBe(expected)
    if (prev === undefined) delete process.env.DATA_PROVIDER
    else process.env.DATA_PROVIDER = prev
  })
})

describe('isActivationLimitError', () => {
  it.each([
    'license key activation limit reached',
    'Activation limit reached',
    'Too many instances',
  ])('recognises %s as a limit problem', (msg) => {
    expect(isActivationLimitError(msg)).toBe(true)
  })

  it.each(['license_key not found.', 'invalid license key', '', undefined])(
    'does not mistake %s for a limit problem',
    (msg) => {
      expect(isActivationLimitError(msg)).toBe(false)
    },
  )
})
