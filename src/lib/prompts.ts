import type { UserProfile } from '@/lib/db/types'

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM PROMPT — built from the user's stored profile
// ─────────────────────────────────────────────────────────────────────────────

export function buildSystemPrompt(profile: UserProfile): string {
  const name = profile.name ?? 'the candidate'

  return `
You are a Senior Career Coach writing job application materials on behalf of ${name}.
Your job is to produce CV and cover letter content that sounds like ${name} actually wrote it — not like an AI, not like a recruiter template.

# Voice & Authenticity Rules — THIS IS CRITICAL

The output must sound like ${name} wrote it themselves. Study their writing style from the CV and LinkedIn content provided:
- Short, direct sentences. No padding.
- Specific over vague. Real examples, not categories.
- Natural verbs: built, identified, set up, ran, fixed, cut, found, doubled, reduced, supported, migrated.
- AVOID recruiter-template openers: "spearheaded", "orchestrated", "championed", "drove synergies", "delivered impactful solutions", "facilitated cross-functional collaboration".
- Bullets should read like something you would say in an interview answer, not like a LinkedIn buzzword list.
- Vary the structure. Not every bullet needs to start with a power verb.
- When the candidate achieved something by identifying a problem themselves and solving it, make that initiative visible.

# Candidate Profile

- Name: ${name}
- Target roles: ${profile.targetRoles.length > 0 ? profile.targetRoles.join(', ') : 'not specified'}
- Career level: ${profile.careerLevel || 'not specified'}
- Preferred work arrangement: ${profile.workArrangement || 'not specified'}
- Target industries: ${profile.preferredIndustries.length > 0 ? profile.preferredIndustries.join(', ') : 'not specified'}
- Target company stages: ${profile.companyStages.length > 0 ? profile.companyStages.join(', ') : 'not specified'}
- Target locations: ${profile.locations.length > 0 ? profile.locations.join(', ') : 'not specified'}

# Employment History

${profile.cvText
    ? profile.cvText.slice(0, 8000)
    : '(CV not yet uploaded — work from the profile preferences above and ask for specifics if needed)'}

${profile.linkedinAbout ? `# LinkedIn About\n${profile.linkedinAbout.slice(0, 2000)}` : ''}
${profile.linkedinSkills ? `# LinkedIn Skills\n${profile.linkedinSkills.slice(0, 500)}` : ''}

# Forbidden Words & Anti-Patterns

Never use: testament, catalyst, tailored, passionately, furthermore, moreover, spearheaded, leverage (use "use" or "apply" instead), dynamic, paradigm.
Never write: "I'm not just [X], I'm also [Y]" / "In today's fast-paced world" / "Deep dive" / "I am writing to apply" / "I am thrilled to" / "I am excited to".
Never use em-dash (—). Use hyphen (-) only.
Never fabricate metrics. Only use numbers that appear in the employment history above.

# Strict Formatting Rules

1. Plain text only. No markdown, no bold, no italics, no hashtags, no headers.
2. No AI commentary. Output only the requested content.
3. Bullet style: every job bullet starts with "- " (hyphen + space).
4. Summary: 380-480 characters including spaces. Count carefully.
5. Job bullets: each under 160 characters.
6. No reference markers ([+1], [+2], etc.).
`.trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// DECODE — extract JD metadata + fit analysis
// ─────────────────────────────────────────────────────────────────────────────

export function buildDecodePrompt(input: string, profile?: UserProfile): string {
  const targetRoles = profile?.targetRoles?.join(', ') || 'not specified'
  const locations = profile?.locations?.join(', ') || 'not specified'

  return `Analyze this job description and extract key details as JSON.

${profile ? `The candidate is targeting: ${targetRoles}. Preferred locations: ${locations}.` : ''}

Job description:
${input.slice(0, 6000)}

Return ONLY a valid JSON object with these exact fields:
{
  "company": "company name",
  "role": "exact job title",
  "location": "city, country",
  "track": "the primary track this role falls under based on the JD",
  "keywords": ["keyword1", "keyword2", ...],
  "companyContext": "1-2 sentences: what this company does and the likely pain point this role exists to solve",
  "fitVerdict": "Strong Fit" or "Investable Stretch" or "Long-Shot Stretch" or "Weak Fit",
  "fitRationale": "1 sentence explaining the verdict against the candidate profile",
  "decode": {
    "repetitionSignals": "top 2-3 terms/themes that repeat — these are what they actually optimize for",
    "orderAndEmphasis": "what appears first and gets most space — reveals true priority",
    "requiredVsNiceToHave": "which requirements are real gates vs. padding",
    "verbChoices": "action verbs that reveal culture (e.g. 'drive' vs 'support', 'own' vs 'collaborate')",
    "betweenTheLines": "what the role is really about that they didn't say directly",
    "whatsMissing": "skills/context conspicuously absent that reveal constraints or team gaps"
  },
  "recruiterQuestions": ["question to verify an uncertain interpretation"]
}

For "keywords": 8-12 ATS terms most critical for this specific role that overlap with the candidate's background.
For "fitVerdict": Strong Fit = clear match on 4+ core requirements. Investable Stretch = 3 core matches + coachable gaps. Long-Shot = 1-2 core matches + significant gaps. Weak Fit = misaligned domain or seniority.`
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE — Pass 1: CV sections (summary + job1 + job2 + job3)
// ─────────────────────────────────────────────────────────────────────────────

export function buildCVPrompt(params: {
  company: string
  role: string
  location: string
  track: string
  keywords: string[]
  jdText?: string
  jobCount?: number
}): string {
  const { company, role, location, track, keywords, jdText, jobCount = 3 } = params
  const count = Math.min(Math.max(jobCount, 2), 6)

  const jobKeys = Array.from({ length: count }, (_, i) => `"job${i + 1}"`).join(', ')

  const jobSections = Array.from({ length: count }, (_, i) => {
    const n = i + 1
    const ordinal = ['Most recent', 'Second most recent', 'Third most recent', 'Fourth most recent', 'Fifth most recent', 'Sixth most recent'][i]
    const bulletCount = n === 1 ? '5' : n <= 3 ? '3-4' : '2-3'
    return `━━━ JOB${n} — ${ordinal} role ━━━
${bulletCount} bullets starting with "- ". Each under 160 characters.
${n === 1 ? `Rules:
- Each bullet leads with something the candidate DECIDED or BUILT or FIXED — not just a task they were responsible for.
- Metrics appear as supporting evidence mid-sentence or at end, never as the subject.
- Vary the opening verb across bullets.` : `Rules:
- Lead with what the candidate drove — the decision, the strategy, the coordination.
- Honest tone — no overselling.${n >= 4 ? '\n- Earlier role: keep brief, focus on what transfers forward.' : ''}`}`
  }).join('\n\n')

  return `Generate tailored CV sections for the candidate applying to: ${role} at ${company}, ${location}.

Track: ${track}
ATS keywords to weave in naturally (do not list them — integrate into sentences): ${keywords.join(', ')}
${jdText ? `\nJob description (use for context and keyword alignment — do not quote directly):\n${jdText.slice(0, 5000)}` : ''}

Return a JSON object with exactly these keys: "summary", ${jobKeys}.
Each job key maps to the corresponding role from the employment history in your system prompt (most recent first).

━━━ VOICE REMINDER ━━━
Write like the candidate wrote it themselves. Short, direct sentences. Specific examples. Natural verbs. Not like a recruiter template.

━━━ SUMMARY ━━━
3-4 sentences. Must be 380-480 characters including spaces — count carefully before returning.
- Open with their core professional identity for the ${track} track in one direct sentence.
- Sentence 2-3: weave in 2-3 ATS keywords naturally while referencing something real from their history.
- Close with a forward-looking statement about impact, not duties.

${jobSections}

Before returning, self-check and silently fix any violation: summary must be 380-480 characters (count them), every bullet under 160 characters, and none of the forbidden words present anywhere.

Return ONLY the JSON object. No commentary, no markdown fences.`
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE — Pass 2: Cover Letter (separate call)
// ─────────────────────────────────────────────────────────────────────────────

export function buildCoverLetterPrompt(params: {
  company: string
  role: string
  location: string
  track: string
  keywords: string[]
  companyContext?: string
  cvSummary?: string
  jdText?: string
}): string {
  const { company, role, location, track, keywords, companyContext, cvSummary, jdText } = params

  return `Write a cover letter body for the candidate applying to: ${role} at ${company}, ${location}.

Track: ${track}
ATS keywords to weave in naturally: ${keywords.join(', ')}
${companyContext ? `\nCompany context: ${companyContext}` : ''}
${cvSummary ? `\nCV summary for this role (stay coherent with this):\n${cvSummary}` : ''}
${jdText ? `\nJob description (use for specificity):\n${jdText.slice(0, 3000)}` : ''}

Write 3 paragraphs of plain text. No greeting, no sign-off, no "Dear Hiring Manager". Body only.

━━━ VOICE REMINDER ━━━
This must sound like the candidate wrote it — practical, direct, not a cover letter template. Short sentences mixed with longer ones. No buzzwords. No corporate speak.

━━━ PARAGRAPH 1 — Hook (3-4 sentences) ━━━
- Open with a specific, real challenge ${company} faces based on the company context and JD. Not a generic industry statement — something specific to them.
- DO NOT start with "I", "I am", "I am writing", "I am thrilled", "I am excited", or any first-person opener.
- The first sentence should make the reader feel like you understand their problem, not like you are applying for a job.
- Transition to why the candidate's specific background is relevant — one direct sentence.

━━━ PARAGRAPH 2 — Proof (4-5 sentences) ━━━
- Lead with the most relevant achievement from the candidate's employment history, reframed to the ${track} track.
- Connect specifically to ${company}'s context — what they are scaling, what they need, what this evidence solves for them.
- Vary sentence rhythm. Mix short punchy statements with compound ones.
- Weave in 2-3 ATS keywords naturally — not a list, part of real sentences.

━━━ PARAGRAPH 3 — Close (2-3 sentences) ━━━
- One confident, direct statement of fit.
- End with what the candidate would build or contribute in this role — a forward-looking statement, not a closing pleasantry.

Before returning, self-check and silently fix any violation: no paragraph starts with a banned opener, no forbidden words present.

Return ONLY the cover letter body text. No JSON, no commentary, no extra formatting.`
}

// ─────────────────────────────────────────────────────────────────────────────
// REGENERATE — single section refresh with a specific instruction
// ─────────────────────────────────────────────────────────────────────────────

export function buildRegeneratePrompt(params: {
  section: string
  company: string
  role: string
  track: string
  currentText: string
  userPrompt: string
  keywords?: string[]
  jdText?: string
  companyContext?: string
}): string {
  const { section, company, role, track, currentText, userPrompt, keywords, jdText, companyContext } = params
  const isCoverLetter = section.toLowerCase().includes('cover')

  return `Regenerate the "${section}" section for the candidate's application to ${role} at ${company} (${track} track).

${keywords?.length ? `ATS keywords to maintain: ${keywords.join(', ')}` : ''}
${companyContext ? `Company context: ${companyContext}` : ''}
${jdText ? `\nJD context:\n${jdText.slice(0, 2000)}` : ''}

Current text:
${currentText}

Requested change:
${userPrompt}

Apply the change precisely. Keep everything else. Maintain all rules:
- Plain text only, no markdown
- Sound like the candidate wrote it — direct, specific, no buzzwords
${isCoverLetter
    ? '- 3 paragraphs, no greeting/sign-off, no "I am writing/thrilled/excited" opener'
    : '- Bullets start with "- ", each under 160 characters'}
${!isCoverLetter && section === 'summary' ? '- Summary: 380-480 characters exactly' : ''}
- No forbidden words: testament, catalyst, tailored, passionately, furthermore, moreover, spearheaded, leverage, dynamic, paradigm

Return ONLY the updated text. No commentary.`
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION QUESTIONS — answer free-text form questions
// ─────────────────────────────────────────────────────────────────────────────

export function buildAnswersPrompt(params: {
  company: string
  role: string
  track?: string
  keywords?: string[]
  cvSummary?: string
  questionsRaw?: string
  regenQuestion?: string
  regenPrompt?: string
}): string {
  const { company, role, track, keywords, cvSummary, questionsRaw, regenQuestion, regenPrompt } = params

  const context = `
TARGET ROLE: ${role} at ${company}${track ? ` (${track})` : ''}
ATS KEYWORDS: ${keywords?.join(', ') || 'not provided'}
CV SUMMARY: ${cvSummary || 'not provided'}
`.trim()

  if (regenQuestion && regenPrompt) {
    return `${context}

TASK: Re-answer a single application question. Apply the feedback instruction.

QUESTION:
${regenQuestion}

FEEDBACK / INSTRUCTION:
${regenPrompt}

Return ONLY the new answer text. No intro, no label, no JSON.`
  }

  return `${context}

TASK: Answer the following application questions on behalf of the candidate. Parse the text to identify each question, then write a concise, authentic answer using their voice and profile from the system prompt.

QUESTIONS:
${questionsRaw}

Return a JSON array with one object per question:
[
  { "question": "<exact question text>", "answer": "<candidate answer>" }
]

Rules:
- Preserve the exact question wording.
- If multiple questions are in one field (e.g. numbered list), split them.
- First person, direct, no fluff. 3-5 sentences per answer.
- Weave in ATS keywords naturally where relevant.
- No forbidden words (testament, catalyst, spearheaded, leverage, etc.).
- Return ONLY valid JSON — no markdown, no commentary.`
}

// ─────────────────────────────────────────────────────────────────────────────
// POST-GENERATION VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationIssue {
  section: string
  issue: string
}

const FORBIDDEN_WORDS = [
  'testament', 'catalyst', 'tailored', 'passionately', 'furthermore',
  'moreover', 'spearheaded', 'leverage', 'dynamic', 'paradigm',
]

function checkForbidden(section: string, text: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const lower = text.toLowerCase()
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) {
      issues.push({ section, issue: `Forbidden word detected: "${word}"` })
    }
  }
  return issues
}

export function validateCV(data: Record<string, string>, jobCount = 3): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const summaryLen = (data.summary ?? '').length
  if (summaryLen < 380 || summaryLen > 480) {
    issues.push({ section: 'summary', issue: `Summary is ${summaryLen} chars — must be 380-480` })
  }
  issues.push(...checkForbidden('summary', data.summary ?? ''))

  const count = Math.min(Math.max(jobCount, 2), 6)
  for (let i = 1; i <= count; i++) {
    const key = `job${i}`
    const raw = Array.isArray(data[key])
      ? (data[key] as unknown as string[]).join('\n')
      : String(data[key] ?? '')
    const bullets = raw.split('\n').filter((l) => l.trim().startsWith('- '))
    bullets.forEach((bullet, idx) => {
      if (bullet.length > 160) {
        issues.push({
          section: key,
          issue: `Job ${i} bullet ${idx + 1} is ${bullet.length} chars (max 160): "${bullet.slice(0, 60)}..."`,
        })
      }
    })
    if (bullets.length === 0) {
      issues.push({ section: key, issue: `${key}: no bullets found — check formatting` })
    }
    issues.push(...checkForbidden(key, raw))
  }

  return issues
}

export function validateCoverLetter(coverLetter: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const lower = coverLetter.toLowerCase().trim()
  const bannedOpeners = ['i am writing', 'i am thrilled', 'i am excited', 'i am pleased', 'dear hiring']
  for (const opener of bannedOpeners) {
    if (lower.startsWith(opener)) {
      issues.push({ section: 'coverLetter', issue: `Cover letter starts with banned opener: "${opener}"` })
    }
  }
  issues.push(...checkForbidden('coverLetter', coverLetter))
  return issues
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUME AUDIT — diagnostic pass over already-generated CV/CL content
// ─────────────────────────────────────────────────────────────────────────────

export function buildResumeAuditPrompt(params: {
  company: string
  role: string
  track: string
  keywords?: string[]
  jdText?: string
  summary: string
  job1: string
  job2: string
  job3: string
  coverLetter: string
  linkedinAbout?: string
}): string {
  const { company, role, track, keywords, jdText, summary, job1, job2, job3, coverLetter, linkedinAbout } = params

  return `Audit this already-generated resume and cover letter for an application to ${role} at ${company} (${track} track). This is a diagnostic review of finished content — do not rewrite it, just critique it and flag specific gaps.
${keywords?.length ? `\nTarget ATS keywords: ${keywords.join(', ')}` : ''}
${jdText ? `\nJob description:\n${jdText.slice(0, 2500)}` : ''}

SUMMARY:
${summary}

JOB1 (most recent):
${job1}

JOB2:
${job2}

JOB3:
${job3}

COVER LETTER:
${coverLetter}
${linkedinAbout ? `\nLINKEDIN ABOUT (for cross-surface consistency check — do not audit this directly):\n${linkedinAbout.slice(0, 2000)}` : ''}

Assess:
1. ATS compatibility — would this parse cleanly? Any formatting or keyword-stuffing risk?
2. Recruiter 6-second scan — what actually registers in a quick scan, what gets missed?
3. Keyword coverage — which target keywords appear naturally, which are missing?
4. Seniority calibration — does the language match the seniority of ${role}?
${linkedinAbout ? `5. Cross-surface consistency — does this resume tell the same story as the LinkedIn About above? Flag genuine contradictions (mismatched titles, dates, or achievements). Do not flag intentional omissions.` : ''}

Return ONLY valid JSON in this exact shape:
{
  "atsCompatibility": "ATS-Ready" or "Needs Work" or "At Risk",
  "recruiterScan": "1-2 sentences on what a recruiter actually sees in a 6-second scan",
  "keywordsCovered": ["keyword"],
  "keywordsMissing": ["keyword"],
  ${linkedinAbout ? '"linkedinConsistency": "1-2 sentences, or null if fully consistent",' : ''}
  "findings": [
    { "section": "summary" or "job1" or "job2" or "job3" or "coverLetter" or "cross-surface", "issue": "specific gap or risk", "suggestedFix": "a short, direct instruction usable to regenerate that exact section" }
  ]
}

Only include findings that are real, specific, and actionable. Cap at 6 findings, ranked by impact. Never suggest fabricating a metric.`
}
