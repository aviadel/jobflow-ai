import { NextRequest, NextResponse } from 'next/server'
import { createDataProvider } from '@/lib/db'
import type { Application } from '@/lib/db/types'
import { randomUUID } from 'crypto'
import { resolveLicense } from '@/lib/license-server'

export async function GET() {
  try {
    const license = await resolveLicense()
    if (!license.valid) return NextResponse.json({ error: 'Valid license required.' }, { status: 403 })

    const db = createDataProvider()
    const apps = await db.listApplications()
    return NextResponse.json(apps)
  } catch (err) {
    console.error('applications GET error:', err)
    return NextResponse.json({ error: 'Failed to load applications.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const license = await resolveLicense()
    if (!license.valid) return NextResponse.json({ error: 'Valid license required.' }, { status: 403 })

    const body = await req.json()
    const { company, role, location, jdUrl, summary, coverLetter, notes } = body

    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required.' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const app: Application = {
      id: randomUUID(),
      company,
      jobTitle: role,
      location,
      url: jdUrl || undefined,
      jdRaw: notes || undefined,
      status: 'applied',
      notes: [summary && `Summary:\n${summary}`, coverLetter && `Cover letter:\n${coverLetter}`]
        .filter(Boolean)
        .join('\n\n---\n\n') || undefined,
      createdAt: now,
      updatedAt: now,
    }

    const db = createDataProvider()
    await db.upsertApplication(app)
    return NextResponse.json({ id: app.id })
  } catch (err) {
    console.error('applications POST error:', err)
    return NextResponse.json({ error: 'Failed to save application.' }, { status: 500 })
  }
}
