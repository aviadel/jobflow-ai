import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildSystemPrompt, buildRegeneratePrompt } from '@/lib/prompts'
import { createDataProvider } from '@/lib/db'
import { resolveLicense } from '@/lib/license-server'

export async function POST(req: NextRequest) {
  try {
    const license = await resolveLicense()
    if (!license.valid) return NextResponse.json({ error: 'Valid license required.' }, { status: 403 })

    const { section, company, role, track, currentText, prompt: userPrompt, keywords, jdText, companyContext } = await req.json()

    if (!section || !currentText) {
      return NextResponse.json({ error: 'Section and current text are required.' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first (/onboarding).' }, { status: 400 })
    }

    const SYSTEM_PROMPT = buildSystemPrompt(profile)
    const prompt = buildRegeneratePrompt({
      section, company, role, track, currentText,
      userPrompt: userPrompt ?? 'Improve this section while keeping all formatting rules.',
      keywords, jdText, companyContext,
    })

    const text = await claudeComplete(SYSTEM_PROMPT, prompt, 1500, 'fast')
    return NextResponse.json({ text })
  } catch (err) {
    console.error('regenerate-section error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Regeneration failed — try again.' }, { status: 500 })
  }
}
