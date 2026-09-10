import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { isSignedLicense, validateLicense } from '@/lib/license'

const PUBLIC_PATHS = new Set([
  '/', '/favicon.ico', '/terms', '/how-it-works', '/api/trial', '/api/license',
])
const PUBLIC_PREFIXES = ['/_next/', '/features/']

const TRIAL_DAYS = 7
const TRIAL_COOKIE = 'jf_trial'

function trialSecret(): string {
  const s = process.env.TRIAL_SECRET
  if (!s) throw new Error('TRIAL_SECRET is not set')
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

function internalSecret(): string | null {
  const s = process.env.TRIAL_SECRET
  if (!s) return null
  return createHmac('sha256', s).update('trial-internal').digest('hex')
}

async function fetchTrialStart(origin: string, secret: string): Promise<number | null> {
  try {
    const res = await fetch(`${origin}/api/trial`, {
      headers: { 'x-internal-secret': secret },
    })
    if (!res.ok) return null
    const data = await res.json() as { startedAt: number | null }
    return data.startedAt
  } catch {
    return null
  }
}

async function isLemonLicenseValid(origin: string, secret: string): Promise<boolean> {
  try {
    const res = await fetch(`${origin}/api/license`, {
      headers: { 'x-internal-secret': secret },
    })
    if (!res.ok) return false
    const data = await res.json() as { valid: boolean }
    return data.valid
  } catch {
    return false
  }
}

async function createTrialInDb(origin: string, secret: string): Promise<number> {
  try {
    const res = await fetch(`${origin}/api/trial`, {
      method: 'POST',
      headers: { 'x-internal-secret': secret },
    })
    if (!res.ok) return Date.now()
    const data = await res.json() as { startedAt: number }
    return data.startedAt
  } catch {
    return Date.now()
  }
}

export async function proxy(request: NextRequest) {
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

  // ── Misconfiguration guard ──────────────────────────────────────────────────
  // Without TRIAL_SECRET the trial gate has nothing to sign with. Send everyone
  // to /setup, which is allowed through so its config check can say what is
  // missing - far better than an opaque 500 on every page.
  if (!process.env.TRIAL_SECRET) {
    if (pathname === '/setup') return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = '/setup'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // ── Valid license bypasses trial entirely ───────────────────────────────────
  const licenseKey = process.env.JOBFLOW_LICENSE_KEY
  const secret = internalSecret()
  if (licenseKey) {
    if (isSignedLicense(licenseKey)) {
      // Our own Ed25519 key - verified locally, no network call.
      if (validateLicense(licenseKey).valid) return NextResponse.next()
    } else if (secret) {
      // Lemon Squeezy key - verdict is cached server-side, so this is a
      // local hop that only reaches LZ once a week.
      if (await isLemonLicenseValid(request.nextUrl.origin, secret)) {
        return NextResponse.next()
      }
    }
  }

  // ── Trial check ─────────────────────────────────────────────────────────────
  const trialVal = request.cookies.get(TRIAL_COOKIE)?.value
  if (trialVal) {
    const { valid, startedAt } = verifyTrialCookie(trialVal)
    if (valid) {
      // Clamped at zero so a future-dated cookie cannot extend the trial.
      const daysElapsed = Math.max(0, Date.now() - startedAt) / 86_400_000
      if (daysElapsed < TRIAL_DAYS) return NextResponse.next()
    }
    // Cookie expired or tampered — fall through to DB check below
  }

  // ── DB check: cookie absent or expired — verify against server-side record ──
  if (secret) {
    const origin = request.nextUrl.origin
    const dbStart = await fetchTrialStart(origin, secret)

    if (dbStart !== null) {
      const daysElapsed = Math.max(0, Date.now() - dbStart) / 86_400_000
      if (daysElapsed >= TRIAL_DAYS) {
        // Trial expired in DB — redirect
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.search = '?expired=1'
        return NextResponse.redirect(url)
      }
      // Trial still valid — re-sync cookie and allow
      const res = NextResponse.next()
      res.cookies.set(TRIAL_COOKIE, makeTrialCookie(dbStart), {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      })
      return res
    }

    // No record in DB — genuine first visit, create trial in DB and set cookie
    const newStart = await createTrialInDb(origin, secret)
    const res = NextResponse.next()
    res.cookies.set(TRIAL_COOKIE, makeTrialCookie(newStart), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  }

  // ── Fallback: no TRIAL_SECRET configured ────────────────────────────────────
  if (trialVal) {
    // Cookie was present but expired/tampered (we fell through from above)
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = '?expired=1'
    return NextResponse.redirect(url)
  }
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
