import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const PUBLIC_PATHS = new Set(['/', '/favicon.ico', '/terms'])
const PUBLIC_PREFIXES = ['/_next/', '/features/']

const TRIAL_DAYS = 7
const TRIAL_COOKIE = 'jf_trial'

function trialSecret(): string {
  const s = process.env.LICENSE_SIGNING_SECRET
  if (!s) throw new Error('LICENSE_SIGNING_SECRET is not set')
  return s
}

function makeTrialCookie(timestamp: number): string {
  const ts = timestamp.toString()
  const sig = createHmac('sha256', trialSecret()).update(ts).digest('hex')
  return `${ts}.${sig}`
}

function verifyTrialCookie(value: string): { valid: boolean; startedAt: number } {
  const dot = value.indexOf('.')
  if (dot === -1) return { valid: false, startedAt: 0 }
  const ts = value.slice(0, dot)
  const sig = value.slice(dot + 1)
  const expectedBuf = createHmac('sha256', trialSecret()).update(ts).digest()
  let sigBuf: Buffer
  try { sigBuf = Buffer.from(sig, 'hex') } catch { return { valid: false, startedAt: 0 } }
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, startedAt: 0 }
  }
  const startedAt = parseInt(ts, 10)
  if (isNaN(startedAt) || startedAt <= 0) return { valid: false, startedAt: 0 }
  return { valid: true, startedAt }
}

function isLicenseValid(): boolean {
  const key = process.env.JOBFLOW_LICENSE_KEY
  const secret = process.env.LICENSE_SIGNING_SECRET
  if (!key || !secret) return false
  const parts = key.split('.')
  if (parts.length !== 3) return false
  const [header, payload, sigB64] = parts
  const expectedBuf = createHmac('sha256', secret).update(`${header}.${payload}`).digest()
  const b64 = sigB64.replace(/-/g, '+').replace(/_/g, '/')
  const pad = (4 - (b64.length % 4)) % 4
  let receivedBuf: Buffer
  try { receivedBuf = Buffer.from(b64 + '='.repeat(pad), 'base64') } catch { return false }
  if (expectedBuf.length !== receivedBuf.length) return false
  return timingSafeEqual(expectedBuf, receivedBuf)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next()
  }

  // ── APP_PASSWORD check ──────────────────────────────────────────────────────
  const password = process.env.APP_PASSWORD
  if (password) {
    const auth = request.headers.get('authorization')
    let passwordOk = false
    if (auth?.startsWith('Basic ')) {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
      const colon = decoded.indexOf(':')
      const submitted = colon !== -1 ? decoded.slice(colon + 1) : decoded
      if (submitted === password) passwordOk = true
    }
    if (!passwordOk) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="JobFlow"' },
      })
    }
  }

  // ── Valid license bypasses trial entirely ───────────────────────────────────
  if (isLicenseValid()) return NextResponse.next()

  // ── Trial check ─────────────────────────────────────────────────────────────
  const trialVal = request.cookies.get(TRIAL_COOKIE)?.value
  if (trialVal) {
    const { valid, startedAt } = verifyTrialCookie(trialVal)
    if (valid) {
      const daysElapsed = (Date.now() - startedAt) / 86_400_000
      if (daysElapsed < TRIAL_DAYS) return NextResponse.next()
    }
    // Trial expired or tampered — send to landing page with ?expired flag
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = '?expired=1'
    return NextResponse.redirect(url)
  }

  // ── No trial yet — start one on first protected-page visit ─────────────────
  const res = NextResponse.next()
  res.cookies.set(TRIAL_COOKIE, makeTrialCookie(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
