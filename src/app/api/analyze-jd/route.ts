import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildDecodePrompt } from '@/lib/prompts'
import { createDataProvider } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { url, text } = await req.json()

    if (!url && !text) {
      return NextResponse.json({ error: 'Provide a job description URL or text.' }, { status: 400 })
    }

    let jdContent = text as string | undefined

    if (url && !text) {
      try {
        const res = await fetch(url as string, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobFlow/1.0)' },
          signal: AbortSignal.timeout(5000),
        })
        const html = await res.text()
        jdContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim()
          .slice(0, 6000)
      } catch {
        return NextResponse.json({ error: 'Could not fetch the URL. Paste the job description text instead.' }, { status: 422 })
      }
    }

    if (!jdContent) {
      return NextResponse.json({ error: 'No job description content found.' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()

    const prompt = buildDecodePrompt(jdContent, profile ?? undefined)
    const raw = await claudeComplete('You are a job description analyst. Return only valid JSON.', prompt, 1200)

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`Non-JSON response: ${raw.slice(0, 200)}`)
    const data = JSON.parse(jsonMatch[0])

    return NextResponse.json({ ...data, jdText: jdContent })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('analyze-jd error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
