import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildSystemPrompt, buildCoverLetterPrompt, buildRegeneratePrompt, validateCoverLetter } from '@/lib/prompts'
import { createDataProvider } from '@/lib/db'
import { resolveLicense } from '@/lib/license-server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const license = await resolveLicense()
    if (!license.valid) return NextResponse.json({ error: 'Valid license required.' }, { status: 403 })

    const body = await req.json()
    const { company, role, location, track, keywords, cvSummary, jdText, companyContext } = body

    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required.' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first (/onboarding).' }, { status: 400 })
    }

    const SYSTEM_PROMPT = buildSystemPrompt(profile)
    const clPrompt = buildCoverLetterPrompt({
      company, role, location, track,
      keywords: keywords ?? [],
      companyContext, cvSummary, jdText,
    })

    let coverLetter = await claudeComplete(SYSTEM_PROMPT, clPrompt, 900, 'fast')

    // One bounded self-correction pass.
    const initialIssues = validateCoverLetter(coverLetter)
    let issues = initialIssues
    if (issues.length > 0) {
      const fixPrompt = buildRegeneratePrompt({
        section: 'coverLetter', company, role, track,
        currentText: coverLetter,
        userPrompt: `Fix only these specific rule violations, keep everything else the same: ${issues.map((i) => i.issue).join('; ')}`,
        keywords, jdText, companyContext,
      })
      try {
        coverLetter = await claudeComplete(SYSTEM_PROMPT, fixPrompt, 900, 'fast')
      } catch { /* keep original if correction fails */ }
      issues = validateCoverLetter(coverLetter)
    }

    if (issues.length > 0) console.warn('Cover letter validation issues after correction pass:', issues)

    return NextResponse.json({
      coverLetter,
      _validationIssues: issues.length > 0 ? issues : undefined,
    })
  } catch (err) {
    console.error('generate-cl error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Failed to generate cover letter. Please try again.' }, { status: 500 })
  }
}
