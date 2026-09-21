import { NextRequest, NextResponse } from 'next/server'
import { claudeComplete } from '@/lib/claude'
import { buildSystemPrompt, buildCVPrompt, buildRegeneratePrompt, validateCV } from '@/lib/prompts'
import { createDataProvider } from '@/lib/db'
import { resolveLicense } from '@/lib/license-server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const license = await resolveLicense()
    if (!license.valid) return NextResponse.json({ error: 'Valid license required.' }, { status: 403 })

    const body = await req.json()
    const { company, role, location, track, keywords, jdText } = body

    if (!company || !role) {
      return NextResponse.json({ error: 'Company and role are required.' }, { status: 400 })
    }

    const db = createDataProvider()
    const profile = await db.getProfile()
    if (!profile) {
      return NextResponse.json({ error: 'Complete your profile first (/onboarding).' }, { status: 400 })
    }

    const jobCount = profile.jobSectionsCount ?? 3
    const SYSTEM_PROMPT = buildSystemPrompt(profile)
    const cvPrompt = buildCVPrompt({ company, role, location, track, keywords, jdText, jobCount })
    const cvRawJson = await claudeComplete(SYSTEM_PROMPT, cvPrompt, 1800 + jobCount * 200, 'fast')

    const jsonMatch = cvRawJson.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error(`Claude returned non-JSON: ${cvRawJson.slice(0, 200)}`)
    const cvData = JSON.parse(jsonMatch[0]) as Record<string, string>

    const cvKeys = ['summary', ...Array.from({ length: jobCount }, (_, i) => `job${i + 1}`)]
    for (const key of cvKeys) {
      if (!cvData[key]) throw new Error(`Missing CV section: ${key}`)
      if (Array.isArray(cvData[key])) cvData[key] = (cvData[key] as unknown as string[]).join('\n')
      if (typeof cvData[key] !== 'string') cvData[key] = String(cvData[key])
    }

    // One bounded self-correction pass: fix formatting violations, re-check once, stop.
    const initialIssues = validateCV(cvData, jobCount)
    let issues = initialIssues
    if (issues.length > 0) {
      const bySection = new Map<string, string[]>()
      for (const iss of issues) {
        if (!bySection.has(iss.section)) bySection.set(iss.section, [])
        bySection.get(iss.section)!.push(iss.issue)
      }
      await Promise.all(
        Array.from(bySection.entries()).map(async ([section, sectionIssues]) => {
          const fixPrompt = buildRegeneratePrompt({
            section, company, role, track,
            currentText: cvData[section],
            userPrompt: `Fix only these specific rule violations, keep everything else the same: ${sectionIssues.join('; ')}`,
            keywords, jdText,
          })
          try {
            cvData[section] = await claudeComplete(SYSTEM_PROMPT, fixPrompt, 800, 'fast')
          } catch { /* keep original section if correction call fails */ }
        }),
      )
      issues = validateCV(cvData, jobCount)
    }

    if (issues.length > 0) console.warn('Validation issues after correction pass:', issues)

    return NextResponse.json({
      ...cvData,
      _validationIssues: issues.length > 0 ? issues : undefined,
    })
  } catch (err) {
    console.error('generate error:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Generation failed — try again.' }, { status: 500 })
  }
}
