import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export default async function proxy(request: NextRequest) {
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

  if (isMarketingSurface(pathname)) {
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
