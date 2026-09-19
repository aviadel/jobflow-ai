import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHmac } from 'crypto'
import { isSignedLicense, validateLicense } from '@/lib/license'

/** Pages that make up the public marketing site. These are the only routes a
 *  MARKETING_ONLY deployment serves. */
const MARKETING_PATHS = new Set([
  '/', '/favicon.ico', '/icon.svg', '/opengraph-image', '/robots.txt',
  '/terms', '/how-it-works', '/install',
])
const MARKETING_PREFIXES = ['/_next/', '/features/']

/** Static assets are public by nature. Returning 401 for one is not a quiet
 *  failure: the browser reacts to WWW-Authenticate by throwing a sign-in
 *  dialog over whatever page requested it, including the public landing page.
 *  Matching by extension also covers metadata routes added later. */
const PUBLIC_FILE = /\.(svg|png|jpe?g|gif|webp|avif|ico|txt|xml|webmanifest|woff2?|ttf)$/i

function isMarketingSurface(pathname: string): boolean {
  return (
    MARKETING_PATHS.has(pathname) ||
    MARKETING_PREFIXES.some((p) => pathname.startsWith(p)) ||
    PUBLIC_FILE.test(pathname)
  )
}

/** Shared secret for the middleware -> /api/license hop. That route sits in
 *  PUBLIC_PATHS to avoid recursing through this proxy, so the header is the
 *  only thing keeping outsiders from triggering license activations. */
function internalSecret(): string | null {
  const s = process.env.INTERNAL_SECRET
  if (!s) return null
  return createHmac('sha256', s).update('license-internal').digest('hex')
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

function toSetup(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/setup'
  url.search = ''
  return NextResponse.redirect(url)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Marketing-only deployment ───────────────────────────────────────────────
  // jobflow-ai.app sells the product; it does not run it. Buyers clone the repo
  // and deploy their own instance, so the app routes here belong to nobody.
  // Send anyone who lands on one back to the marketing site rather than showing
  // them a password prompt for an instance they have no claim to.
  if (process.env.MARKETING_ONLY === '1') {
    if (isMarketingSurface(pathname)) return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // /api/license is the middleware's own bridge to the DB-cached verdict. It is
  // exempt from the password check to avoid recursing through this proxy, and
  // is guarded by its own internal-secret header instead.
  if (isMarketingSurface(pathname) || pathname === '/api/license') {
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

  // ── License check ───────────────────────────────────────────────────────────
  // JobFlow is paid-only: no valid license, no access. Failures land on /setup,
  // which is always reachable so its config check can explain what is missing.
  if (pathname === '/setup') return NextResponse.next()

  const licenseKey = process.env.JOBFLOW_LICENSE_KEY
  if (!licenseKey) return toSetup(request)

  if (isSignedLicense(licenseKey)) {
    // One of our own Ed25519 keys - verified locally, no network call.
    return validateLicense(licenseKey).valid
      ? NextResponse.next()
      : toSetup(request)
  }

  // Lemon Squeezy key. The verdict is cached server-side, so this is a local
  // hop that only reaches LZ once a week.
  const secret = internalSecret()
  if (!secret) return toSetup(request)

  return (await isLemonLicenseValid(request.nextUrl.origin, secret))
    ? NextResponse.next()
    : toSetup(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
