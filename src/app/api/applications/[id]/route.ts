import { NextRequest, NextResponse } from 'next/server'
import { createDataProvider } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = createDataProvider()
    const existing = await db.getApplication(id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { status, notes, url, location, jobTitle } = body
    const updated = await db.upsertApplication({
      ...existing,
      ...(status    !== undefined && { status }),
      ...(notes     !== undefined && { notes }),
      ...(url       !== undefined && { url }),
      ...(location  !== undefined && { location }),
      ...(jobTitle  !== undefined && { jobTitle }),
      id,
      updatedAt: new Date().toISOString(),
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('applications PATCH error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = createDataProvider()
    await db.deleteApplication(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('applications DELETE error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Delete failed.' }, { status: 500 })
  }
}
