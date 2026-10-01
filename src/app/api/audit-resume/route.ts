import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildSystemPrompt, buildResumeAuditPrompt } from '@/lib/prompts'
import { createDataProvider } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { company, role, track, keywords, jdText, summary, job1, job2, job3, coverLetter } = await req.json()

    if (!summary || !coverLetter) {
      return NextResponse.json({ error: 'Generated content is required before auditing.' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first (/onboarding).' }, { status: 400 })
    }

    const SYSTEM_PROMPT = buildSystemPrompt(profile)
    const prompt = buildResumeAuditPrompt({
      company, role, track, keywords, jdText,
      summary, job1, job2, job3, coverLetter,
      linkedinAbout: profile.linkedinAbout,
    })

    const raw = await claudeComplete(SYSTEM_PROMPT, prompt, 1500, 'fast')
    const cleaned = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
    const data = JSON.parse(cleaned)
    return NextResponse.json(data)
  } catch (err) {
    console.error('audit-resume error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Audit failed — try again.' }, { status: 500 })
  }
}
