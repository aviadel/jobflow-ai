import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { createDataProvider } from '@/lib/db'

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

export async function GET(req: NextRequest) {
  if (!validateSecret(req)) return new Response('Forbidden', { status: 403 })
  const db = createDataProvider()
  const startedAt = await db.getTrialStart()
  return Response.json({ startedAt })
}

export async function POST(req: NextRequest) {
  if (!validateSecret(req)) return new Response('Forbidden', { status: 403 })
  const db = createDataProvider()
  const existing = await db.getTrialStart()
  if (existing !== null) {
    return Response.json({ startedAt: existing })
  }
  const now = Date.now()
  await db.setTrialStart(now)
  return Response.json({ startedAt: now })
}
