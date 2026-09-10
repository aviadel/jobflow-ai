#!/usr/bin/env node
/**
 * Generates a signed JobFlow license key.
 *
 * Requires the Ed25519 private key, which is NOT in this repo. Only the
 * developer holds it. Buyers receive the public key (in src/lib/license.ts),
 * which can verify a key but cannot create one.
 *
 * Usage:
 *   node scripts/generate-license.mjs <tier> [email]
 *
 *   tier   starter | professional | lifetime
 *   email  optional, embedded in the key for your own records
 *
 * The private key is read from LICENSE_PRIVATE_KEY (PEM contents) or, failing
 * that, from ./license-private-key.pem
 */

import { createPrivateKey, sign } from 'crypto'
import { readFileSync } from 'fs'

const VALID_TIERS = ['starter', 'professional', 'lifetime']

function loadPrivateKey() {
  const inline = process.env.LICENSE_PRIVATE_KEY
  if (inline) return createPrivateKey(inline)
  try {
    return createPrivateKey(readFileSync('license-private-key.pem', 'utf-8'))
  } catch {
    console.error('No private key found.')
    console.error('Set LICENSE_PRIVATE_KEY or place license-private-key.pem in the repo root.')
    process.exit(1)
  }
}

const [tier, email] = process.argv.slice(2)

if (!VALID_TIERS.includes(tier)) {
  console.error(`Usage: node scripts/generate-license.mjs <${VALID_TIERS.join('|')}> [email]`)
  process.exit(1)
}

const header = Buffer.from(JSON.stringify({ alg: 'EdDSA', typ: 'JWT' })).toString('base64url')
const payload = Buffer.from(JSON.stringify({
  tier,
  issued: new Date().toISOString().slice(0, 10),
  ...(email ? { email } : {}),
})).toString('base64url')

const signature = sign(null, Buffer.from(`${header}.${payload}`), loadPrivateKey())
  .toString('base64url')

console.log(`${header}.${payload}.${signature}`)
