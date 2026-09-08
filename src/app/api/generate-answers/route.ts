import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildSystemPrompt, buildAnswersPrompt } from '@/lib/prompts'
import { validateLicense } from '@/lib/license'
import { createDataProvider } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Professional+ feature gate
    const license = validateLicense(process.env.JOBFLOW_LICENSE_KEY)
    if (!license.valid || (license.tier !== 'professional' && license.tier !== 'lifetime')) {
      return NextResponse.json({ error: 'Application question answering requires a Professional or Lifetime license.' }, { status: 403 })
    }

    const { company, role, track, keywords, cvSummary, questionsRaw, regenQuestion, regenPrompt } = await req.json()

    if (!company || !role) {
      return NextResponse.json({ error: 'company and role are required' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first (/onboarding).' }, { status: 400 })
    }

    const SYSTEM_PROMPT = buildSystemPrompt(profile)
    const prompt = buildAnswersPrompt({ company, role, track, keywords, cvSummary, questionsRaw, regenQuestion, regenPrompt })
    const raw = await claudeComplete(SYSTEM_PROMPT, prompt, 1200, 'fast')

    if (regenQuestion) {
      return NextResponse.json({ answer: raw.trim() })
    }

    const match = raw.match(/\[[\s\S]*\]/)
    if (!match) throw new Error(`Claude returned non-JSON: ${raw.slice(0, 200)}`)
    const answers = JSON.parse(match[0]) as { question: string; answer: string }[]
    return NextResponse.json({ answers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('generate-answers error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
