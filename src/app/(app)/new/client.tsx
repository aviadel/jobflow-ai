'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { LicenseTier } from '@/lib/license'

const RESPONSIVE = `
  .jf-two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  .jf-two-col-lg { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
  .jf-action-bar { position:fixed; bottom:0; left:0; right:0; background:#fff; border-top:1px solid #D9D6CE; padding:12px 20px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .jf-action-bar-downloads { display:flex; gap:6px; }
  @media(max-width:560px){
    .jf-two-col, .jf-two-col-lg { grid-template-columns:1fr; }
    .jf-action-bar-downloads { display:none; }
    .jf-action-bar { padding:10px 16px; }
  }
`

// ── DOCX download ─────────────────────────────────────────────────────────────

async function downloadDocx(
  sections: Record<string, string>,
  role: string,
  company: string,
  type: 'cv' | 'cl',
) {
  const { Document, Paragraph, TextRun, HeadingLevel, Packer } = await import('docx')

  function textParagraphs(text: string, heading?: string) {
    const items: InstanceType<typeof Paragraph>[] = []
    if (heading) {
      items.push(new Paragraph({ text: heading, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 80 } }))
    }
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      items.push(new Paragraph({
        children: [new TextRun({ text: trimmed, size: 22 })],
        spacing: { after: trimmed.startsWith('-') || trimmed.startsWith('•') ? 40 : 80 },
        indent: trimmed.startsWith('-') || trimmed.startsWith('•') ? { left: 360 } : undefined,
      }))
    }
    return items
  }

  let children: InstanceType<typeof Paragraph>[]

  if (type === 'cv') {
    children = [
      new Paragraph({
        children: [new TextRun({ text: `${role} · ${company}`, bold: true, size: 32 })],
        spacing: { after: 200 },
      }),
      ...textParagraphs(sections['summary'] ?? '', 'Summary'),
      ...Object.keys(sections)
        .filter(k => /^job\d+$/.test(k))
        .sort((a, b) => parseInt(a.slice(3)) - parseInt(b.slice(3)))
        .flatMap((k, i) => textParagraphs(sections[k], `Experience ${i + 1}`)),
    ]
  } else {
    children = [
      new Paragraph({
        children: [new TextRun({ text: `Cover Letter — ${role} at ${company}`, bold: true, size: 28 })],
        spacing: { after: 200 },
      }),
      ...textParagraphs(sections['coverLetter'] ?? ''),
    ]
  }

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = type === 'cv'
    ? `CV_${company.replace(/\s+/g, '_')}_${role.replace(/\s+/g, '_')}.docx`
    : `CoverLetter_${company.replace(/\s+/g, '_')}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Tier = LicenseTier | 'trial'

type JDAnalysis = {
  company: string
  role: string
  location: string
  track: string
  keywords: string[]
  jdText?: string
  fitVerdict?: string
  fitRationale?: string
}

type AuditFinding = {
  section: string
  issue: string
  suggestedFix?: string
}

type AuditResult = {
  atsCompatibility: string
  recruiterScan: string
  keywordsCovered: string[]
  keywordsMissing: string[]
  linkedinConsistency?: string | null
  findings: AuditFinding[]
}

// ── Style constants ───────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12, padding: 20, marginBottom: 14,
}

const cardApproved: React.CSSProperties = {
  ...card, border: '1px solid #86EFAC', background: '#F0FDF4',
}

const cardLocked: React.CSSProperties = {
  ...card, opacity: 0.7,
}

const inp: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1px solid #D9D6CE', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: '#1A1917', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
}

const inpFilled: React.CSSProperties = {
  ...inp, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF',
}

const btn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 8, border: '1px solid #D9D6CE', background: '#fff',
  color: '#1A1917', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' as const,
}

const btnPrimary: React.CSSProperties = {
  ...btn, background: '#2362D4', border: '1px solid #2362D4', color: '#fff',
}

const btnSuccess: React.CSSProperties = {
  ...btn, background: '#14532D', border: '1px solid #14532D', color: '#fff',
}

function badge(color: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple'): React.CSSProperties {
  const map = {
    blue:   { background: '#DBEAFE', color: '#1E40AF' },
    green:  { background: '#DCFCE7', color: '#14532D' },
    amber:  { background: '#FEF9C3', color: '#713F12' },
    red:    { background: '#FEE2E2', color: '#7F1D1D' },
    gray:   { background: '#F3F4F6', color: '#374151' },
    purple: { background: '#F3E8FF', color: '#6B21A8' },
  }
  return { display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, ...map[color] }
}

function sectionMeta(key: string): { title: string; hint: string } {
  if (key === 'summary') return { title: 'Summary', hint: '380–480 characters' }
  if (key === 'coverLetter') return { title: 'Cover letter', hint: '3 paragraphs' }
  const labels = ['Most recent role', '2nd role', '3rd role', '4th role', '5th role', '6th role']
  const hints  = ['5 bullets', '3–4 bullets', '3–4 bullets', '2–3 bullets', '2–3 bullets', '2 bullets']
  const i = parseInt(key.slice(3), 10) - 1
  return { title: labels[i] ?? key, hint: hints[i] ?? '2–3 bullets' }
}

function orderedKeys(content: Record<string, string>): string[] {
  const jobs = Object.keys(content)
    .filter(k => /^job\d+$/.test(k))
    .sort((a, b) => parseInt(a.slice(3)) - parseInt(b.slice(3)))
  return ['summary', ...jobs, 'coverLetter'].filter(k => k in content)
}

function isPro(tier: Tier) {
  return tier === 'professional' || tier === 'lifetime'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NewClient({ tier }: { tier: Tier }) {
  // Phase 1 — JD input
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url')
  const [jdUrl, setJdUrl] = useState('')
  const [jdText, setJdText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeErr, setAnalyzeErr] = useState('')

  // Phase 2 — Analysis + editable fields
  const [analysis, setAnalysis] = useState<JDAnalysis | null>(null)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [track, setTrack] = useState('')

  // Phase 3 — Generated content
  const [content, setContent] = useState<Record<string, string> | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatingCL, setGeneratingCL] = useState(false)
  const [generateErr, setGenerateErr] = useState('')
  const [approved, setApproved] = useState<Record<string, boolean>>({})
  const [regenPrompts, setRegenPrompts] = useState<Record<string, string>>({})
  const [regenLoading, setRegenLoading] = useState<Record<string, boolean>>({})
  const [validationIssues, setValidationIssues] = useState<{ section: string; issue: string }[]>([])
  const [fixingValidation, setFixingValidation] = useState<number | null>(null)

  // Audit (Pro feature)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [auditing, setAuditing] = useState(false)
  const [auditErr, setAuditErr] = useState('')
  const [fixingFinding, setFixingFinding] = useState<number | null>(null)

  // Application questions (Pro feature)
  const [appQuestions, setAppQuestions] = useState('')
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([])
  const [answering, setAnswering] = useState(false)
  const [answerErr, setAnswerErr] = useState('')
  const [answerRegenPrompts, setAnswerRegenPrompts] = useState<string[]>([])
  const [answerRegenLoading, setAnswerRegenLoading] = useState<boolean[]>([])

  // Save
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  // Derived
  const keys = content ? orderedKeys(content) : []
  const approvedCount = keys.filter(k => approved[k]).length
  const allApproved = keys.length > 0 && approvedCount === keys.length

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleAnalyze() {
    setAnalyzing(true); setAnalyzeErr('')
    try {
      const res = await fetch('/api/analyze-jd', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputMode === 'url' ? jdUrl : undefined, text: inputMode === 'text' ? jdText : undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setAnalysis(data); setCompany(data.company); setRole(data.role); setLocation(data.location); setTrack(data.track)
    } catch (e) { setAnalyzeErr(e instanceof Error ? e.message : 'Something went wrong') }
    finally { setAnalyzing(false) }
  }

  async function handleGenerate() {
    setGenerating(true); setGeneratingCL(false); setGenerateErr(''); setValidationIssues([])
    const shared = { company, role, location, track, keywords: analysis?.keywords ?? [], jdText: analysis?.jdText }
    try {
      const cvRes = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shared),
      })
      const cvData = await cvRes.json()
      if (!cvRes.ok) throw new Error(cvData.error || 'CV generation failed')

      const { _validationIssues: cvIssues, ...cvContent } = cvData
      setContent({ ...cvContent, coverLetter: '' })
      if (cvIssues?.length) setValidationIssues(cvIssues)
      setGenerating(false); setGeneratingCL(true)

      const clRes = await fetch('/api/generate-cl', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...shared, cvSummary: cvContent.summary }),
      })
      const clData = await clRes.json()
      if (!clRes.ok) throw new Error(clData.error || 'Cover letter generation failed')

      setContent(prev => prev ? { ...prev, coverLetter: clData.coverLetter } : prev)
      if (clData._validationIssues?.length) setValidationIssues(p => [...p, ...clData._validationIssues])

      const allKeys = orderedKeys({ ...cvContent, coverLetter: clData.coverLetter })
      setApproved(Object.fromEntries(allKeys.map(k => [k, false])))
      setRegenPrompts(Object.fromEntries(allKeys.map(k => [k, ''])))
      setRegenLoading(Object.fromEntries(allKeys.map(k => [k, false])))
    } catch (e) { setGenerateErr(e instanceof Error ? e.message : 'Something went wrong') }
    finally { setGenerating(false); setGeneratingCL(false) }
  }

  async function handleRegen(key: string, overridePrompt?: string) {
    setRegenLoading(p => ({ ...p, [key]: true }))
    try {
      const res = await fetch('/api/regenerate-section', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: key, company, role, track, currentText: content?.[key], prompt: overridePrompt ?? regenPrompts[key], keywords: analysis?.keywords, jdText: analysis?.jdText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setContent(p => p ? { ...p, [key]: data.text } : p)
      setApproved(p => ({ ...p, [key]: false }))
    } catch { /* keep original */ }
    finally { setRegenLoading(p => ({ ...p, [key]: false })) }
  }

  async function handleAudit() {
    if (!content) return
    setAuditing(true); setAuditErr(''); setAuditResult(null)
    try {
      const res = await fetch('/api/audit-resume', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, track, keywords: analysis?.keywords, jdText: analysis?.jdText, ...content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAuditResult(data)
    } catch (e) { setAuditErr(e instanceof Error ? e.message : 'Audit failed') }
    finally { setAuditing(false) }
  }

  async function handleFixFinding(idx: number, finding: AuditFinding) {
    if (finding.section === 'cross-surface' || !finding.suggestedFix) return
    setFixingFinding(idx)
    await handleRegen(finding.section, finding.suggestedFix)
    setFixingFinding(null)
    setAuditResult(p => p ? { ...p, findings: p.findings.filter((_, i) => i !== idx) } : p)
  }

  async function handleFixValidation(idx: number, section: string, issue: string) {
    setFixingValidation(idx)
    await handleRegen(section, `Fix only this specific rule violation, keep everything else the same: ${issue}`)
    setFixingValidation(null)
    setValidationIssues(p => p.filter((_, i) => i !== idx))
  }

  async function handleGenerateAnswers() {
    if (!appQuestions.trim()) return
    setAnswering(true); setAnswerErr('')
    try {
      const res = await fetch('/api/generate-answers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, track, keywords: analysis?.keywords, cvSummary: content?.summary, questionsRaw: appQuestions }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate answers')
      setAnswers(data.answers)
      setAnswerRegenPrompts(data.answers.map(() => ''))
      setAnswerRegenLoading(data.answers.map(() => false))
    } catch (e) { setAnswerErr(e instanceof Error ? e.message : 'Something went wrong') }
    finally { setAnswering(false) }
  }

  async function handleRegenAnswer(idx: number) {
    const q = answers[idx]
    if (!q) return
    setAnswerRegenLoading(p => { const n = [...p]; n[idx] = true; return n })
    try {
      const res = await fetch('/api/generate-answers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, track, keywords: analysis?.keywords, cvSummary: content?.summary, regenQuestion: q.question, regenPrompt: answerRegenPrompts[idx] || 'Improve the answer' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAnswers(p => p.map((a, i) => i === idx ? { ...a, answer: data.answer } : a))
    } catch { /* keep unchanged */ }
    finally { setAnswerRegenLoading(p => { const n = [...p]; n[idx] = false; return n }) }
  }

  async function handleSave() {
    if (!content || !allApproved) return
    setSaving(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, location, track, jdUrl: inputMode === 'url' ? jdUrl : undefined, summary: content.summary, coverLetter: content.coverLetter, notes: analysis?.jdText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSavedId(data.id)
    } catch (e) { alert(e instanceof Error ? e.message : 'Save failed') }
    finally { setSaving(false) }
  }

  // ── Pro feature lock card ──────────────────────────────────────────────────

  function ProLock({ feature }: { feature: string }) {
    return (
      <div style={cardLocked}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>{feature}</span>
              <span style={badge('purple')}>Professional</span>
            </div>
            <p style={{ fontSize: 12, color: '#6B6660' }}>Upgrade your license to unlock this feature.</p>
          </div>
          <Link href="/" style={{ ...btn, textDecoration: 'none', flexShrink: 0, fontSize: 12 }}>
            Upgrade →
          </Link>
        </div>
      </div>
    )
  }

  // ── Review phase ──────────────────────────────────────────────────────────

  if (content) return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px 100px' }}>
      <style>{RESPONSIVE}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 4 }}>
            Reviewing
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1917', margin: 0 }}>{role} — {company}</h2>
          <p style={{ fontSize: 13, color: '#6B6660', marginTop: 3 }}>
            {location} · {track}{analysis?.keywords?.length ? ` · ${analysis.keywords.length} ATS keywords` : ''}
          </p>
        </div>
        <button style={btn} onClick={() => { setContent(null); setAuditResult(null); setValidationIssues([]) }}>← Re-generate</button>
      </div>

      {/* ATS keywords */}
      {analysis?.keywords?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
          {analysis.keywords.map(k => <span key={k} style={badge('blue')}>{k}</span>)}
        </div>
      ) : null}

      {/* Validation issues */}
      {validationIssues.length > 0 && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#C2410C', marginBottom: 8 }}>
            ⚠ {validationIssues.length} rule violation{validationIssues.length !== 1 ? 's' : ''} — Claude tried to self-fix and these persisted
          </p>
          {validationIssues.map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '4px 0' }}>
              <span style={{ fontSize: 12, color: '#1A1917' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#6B6660', textTransform: 'uppercase', marginRight: 6 }}>{v.section}</span>
                {v.issue}
              </span>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button style={{ ...btn, fontSize: 11, padding: '3px 9px' }} onClick={() => setValidationIssues(p => p.filter((_, idx) => idx !== i))}>Ignore</button>
                <button style={{ ...btn, fontSize: 11, padding: '3px 9px', opacity: fixingValidation === i ? 0.6 : 1 }} onClick={() => handleFixValidation(i, v.section, v.issue)} disabled={fixingValidation !== null}>
                  {fixingValidation === i ? 'Fixing…' : 'Fix this'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resume audit — Pro feature */}
      {isPro(tier) ? (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>Audit this application</p>
                <span style={badge('purple')}>Professional</span>
              </div>
              <p style={{ fontSize: 12, color: '#6B6660' }}>ATS check, recruiter-scan read, keyword coverage + LinkedIn consistency</p>
            </div>
            <button style={{ ...btn, flexShrink: 0, opacity: auditing ? 0.6 : 1 }} onClick={handleAudit} disabled={auditing}>
              {auditing ? 'Auditing…' : 'Run audit'}
            </button>
          </div>
          {auditErr && <p style={{ fontSize: 12, color: '#B91C1C', marginTop: 10 }}>{auditErr}</p>}
          {auditResult && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #D9D6CE' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={badge(auditResult.atsCompatibility === 'ATS-Ready' ? 'green' : auditResult.atsCompatibility === 'Needs Work' ? 'amber' : 'red')}>
                  {auditResult.atsCompatibility}
                </span>
                {auditResult.keywordsMissing.length > 0 && (
                  <span style={{ fontSize: 12, color: '#92400E' }}>
                    {auditResult.keywordsMissing.length} missing: {auditResult.keywordsMissing.join(', ')}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 12, color: '#6B6660', lineHeight: 1.6, marginBottom: 10 }}>{auditResult.recruiterScan}</p>
              {auditResult.linkedinConsistency && (
                <p style={{ fontSize: 12, color: '#1E40AF', background: '#EFF6FF', borderRadius: 6, padding: '8px 10px', marginBottom: 10 }}>
                  LinkedIn: {auditResult.linkedinConsistency}
                </p>
              )}
              {auditResult.findings.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: '1px solid #F3F4F6' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#6B6660', textTransform: 'uppercase', marginRight: 6 }}>{f.section}</span>
                    <span style={{ fontSize: 12, color: '#1A1917' }}>{f.issue}</span>
                  </div>
                  {f.suggestedFix && f.section !== 'cross-surface' && (
                    <button style={{ ...btn, flexShrink: 0, fontSize: 11, padding: '3px 9px', opacity: fixingFinding === i ? 0.6 : 1 }} onClick={() => handleFixFinding(i, f)} disabled={fixingFinding !== null}>
                      {fixingFinding === i ? 'Fixing…' : 'Fix this'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : <ProLock feature="Resume audit" />}

      {/* Section cards */}
      {keys.map((key) => {
        const { title, hint } = sectionMeta(key)
        const isApproved = approved[key]
        const text = content[key] ?? ''
        return (
          <div key={key} style={isApproved ? cardApproved : card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>{title}</span>
                <span style={{ fontSize: 11, color: '#A8A29E' }}>{hint}</span>
                {key === 'summary' && (
                  <span style={{ fontSize: 11, color: text.length < 380 || text.length > 480 ? '#B91C1C' : '#6B6660' }}>
                    {text.length}/480
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {isApproved ? (
                  <>
                    <span style={badge('green')}>✓ Approved</span>
                    <button style={{ ...btn, fontSize: 11, padding: '3px 9px' }} onClick={() => setApproved(p => ({ ...p, [key]: false }))}>Edit</button>
                  </>
                ) : (
                  <button style={{ ...btn, fontSize: 11, padding: '3px 10px', borderColor: '#86EFAC', color: '#14532D' }} onClick={() => setApproved(p => ({ ...p, [key]: true }))}>
                    ✓ Approve
                  </button>
                )}
              </div>
            </div>
            {isApproved ? (
              <pre style={{ fontSize: 12, color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{text}</pre>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={e => setContent(p => p ? { ...p, [key]: e.target.value } : p)}
                  style={{ ...inp, height: key === 'coverLetter' ? 180 : key === 'summary' ? 88 : 130, resize: 'vertical', lineHeight: 1.7, fontSize: 12 }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    style={{ ...inp, flex: 1, fontSize: 12, padding: '7px 11px' }}
                    placeholder="Not happy? Tell Claude what to change…"
                    value={regenPrompts[key] ?? ''}
                    onChange={e => setRegenPrompts(p => ({ ...p, [key]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleRegen(key) }}
                  />
                  <button style={{ ...btn, opacity: regenLoading[key] ? 0.6 : 1 }} onClick={() => handleRegen(key)} disabled={!!regenLoading[key]}>
                    {regenLoading[key] ? 'Generating…' : 'Regenerate'}
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}

      {/* Application questions — Pro feature */}
      {isPro(tier) ? (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>Application questions</p>
            <span style={badge('purple')}>Professional</span>
          </div>
          <textarea
            value={appQuestions}
            onChange={e => setAppQuestions(e.target.value)}
            placeholder={'Paste 1–4 questions from the application form here…\n\n1. Describe your experience managing enterprise onboarding.\n2. How do you handle delays caused by client-side delays?'}
            rows={4}
            style={{ ...inp, resize: 'vertical', lineHeight: 1.6, marginBottom: 10 }}
          />
          {answerErr && <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 8 }}>{answerErr}</p>}
          <button
            style={{ ...btnPrimary, opacity: answering || !appQuestions.trim() ? 0.5 : 1 }}
            onClick={handleGenerateAnswers}
            disabled={answering || !appQuestions.trim()}
          >
            {answering ? 'Generating answers…' : answers.length ? 'Regenerate all' : 'Generate answers'}
          </button>

          {answers.map((qa, idx) => (
            <div key={idx} style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #D9D6CE' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6B6660', marginBottom: 6 }}>{qa.question}</p>
              <textarea
                value={qa.answer}
                onChange={e => setAnswers(p => p.map((a, i) => i === idx ? { ...a, answer: e.target.value } : a))}
                rows={4}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.6, marginBottom: 7 }}
              />
              <div style={{ display: 'flex', gap: 7 }}>
                <input
                  value={answerRegenPrompts[idx] ?? ''}
                  onChange={e => setAnswerRegenPrompts(p => { const n = [...p]; n[idx] = e.target.value; return n })}
                  placeholder="Guidance for regenerate (optional)…"
                  style={{ ...inp, flex: 1, fontSize: 12, padding: '6px 10px' }}
                />
                <button
                  style={{ ...btn, opacity: answerRegenLoading[idx] ? 0.5 : 1 }}
                  onClick={() => handleRegenAnswer(idx)}
                  disabled={answerRegenLoading[idx]}
                >
                  {answerRegenLoading[idx] ? 'Generating…' : 'Regenerate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : <ProLock feature="Application questions" />}

      {/* Bottom action bar */}
      <div className="jf-action-bar">
        <span style={{ fontSize: 13, color: allApproved ? '#14532D' : '#6B6660', flex: 1, minWidth: 140 }}>
          {allApproved ? 'All sections approved — ready to save' : `${approvedCount} of ${keys.length} sections approved`}
        </span>
        <div className="jf-action-bar-downloads">
          <button
            style={{ ...btn, fontSize: 12 }}
            onClick={() => downloadDocx(content, role, company, 'cv')}
            title="Download CV as Word document"
          >
            ↓ CV
          </button>
          <button
            style={{ ...btn, fontSize: 12 }}
            onClick={() => downloadDocx(content, role, company, 'cl')}
            disabled={!content['coverLetter']}
            title="Download cover letter as Word document"
          >
            ↓ Cover letter
          </button>
        </div>
        {savedId ? (
          <>
            <span style={{ ...badge('green'), fontSize: 12 }}>✓ Saved</span>
            <Link href="/tracker" style={{ ...btn, textDecoration: 'none' }}>View in tracker →</Link>
          </>
        ) : (
          <button style={{ ...btnSuccess, opacity: allApproved && !saving ? 1 : 0.4 }} onClick={handleSave} disabled={!allApproved || saving}>
            {saving ? 'Saving…' : 'Save to tracker'}
          </button>
        )}
      </div>
    </div>
  )

  // ── Input phase ────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <style>{RESPONSIVE}</style>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 10 }}>
        New application
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#1A1917', marginBottom: 6 }}>Add a job description</h1>
      <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 28 }}>
        Paste a URL or text — Claude decodes the JD, then you review and confirm before generating.
      </p>

      <div style={card}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#6B6660', marginBottom: 14 }}>
          Step 1 — Job description
        </p>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {(['url', 'text'] as const).map(m => (
            <button key={m} onClick={() => setInputMode(m)} style={{ ...btn, background: inputMode === m ? '#EFF6FF' : '#fff', borderColor: inputMode === m ? '#2362D4' : '#D9D6CE', color: inputMode === m ? '#2362D4' : '#6B6660', fontSize: 12, padding: '5px 14px' }}>
              {m === 'url' ? 'Paste URL' : 'Paste JD text'}
            </button>
          ))}
        </div>
        {inputMode === 'url' ? (
          <input style={{ ...inp, marginBottom: 12 }} placeholder="https://jobs.company.com/position-id" value={jdUrl} onChange={e => setJdUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && jdUrl) handleAnalyze() }} />
        ) : (
          <textarea style={{ ...inp, height: 100, resize: 'none', lineHeight: 1.6, marginBottom: 12 }} placeholder="Paste the full job description text here…" value={jdText} onChange={e => setJdText(e.target.value)} />
        )}
        {analyzeErr && <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 10 }}>{analyzeErr}</p>}
        <button style={{ ...btnPrimary, opacity: analyzing || (!jdUrl && !jdText) ? 0.5 : 1 }} onClick={handleAnalyze} disabled={analyzing || (!jdUrl && !jdText)}>
          {analyzing ? 'Analyzing…' : 'Analyze JD'}
        </button>
      </div>

      {analysis && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={badge('green')}>✓ JD analyzed</span>
            {analysis.fitVerdict && (
              <span style={badge(analysis.fitVerdict === 'Strong Fit' ? 'green' : analysis.fitVerdict === 'Weak Fit' ? 'red' : 'amber')}>
                {analysis.fitVerdict}
              </span>
            )}
            <button style={{ ...btn, fontSize: 11, padding: '3px 9px', marginLeft: 'auto' }} onClick={() => setAnalysis(null)}>Re-analyze</button>
          </div>
          {analysis.fitRationale && <p style={{ fontSize: 12, color: '#6B6660', marginBottom: 16, lineHeight: 1.6 }}>{analysis.fitRationale}</p>}

          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: '#6B6660', marginBottom: 12 }}>
            Step 2 — Confirm details before generating
          </p>
          <div className="jf-two-col">
            {([{ label: 'Role', value: role, setter: setRole }, { label: 'Company', value: company, setter: setCompany }] as const).map(({ label, value, setter }) => (
              <div key={label}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1917', marginBottom: 5 }}>{label} <span style={{ color: '#2362D4', fontWeight: 400 }}>auto-filled</span></p>
                <input style={inpFilled} value={value} onChange={e => setter(e.target.value)} />
              </div>
            ))}
          </div>
          <div className="jf-two-col-lg">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1917', marginBottom: 5 }}>Location <span style={{ color: '#2362D4', fontWeight: 400 }}>auto-filled</span></p>
              <input style={inpFilled} value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#1A1917', marginBottom: 5 }}>Track</p>
              <input style={inp} value={track} onChange={e => setTrack(e.target.value)} placeholder="e.g. PM / Implementation, CSM, Engineering" />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6B6660', marginBottom: 8 }}>ATS keywords</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {analysis.keywords.map(k => <span key={k} style={badge('blue')}>{k}</span>)}
            </div>
          </div>
          {generateErr && <p style={{ fontSize: 12, color: '#B91C1C', marginBottom: 10 }}>{generateErr}</p>}
          <button style={{ ...btnPrimary, width: '100%', justifyContent: 'center', opacity: generating || generatingCL ? 0.7 : 1 }} onClick={handleGenerate} disabled={generating || generatingCL}>
            {generating ? 'Generating CV sections…' : generatingCL ? 'Writing cover letter…' : 'Generate tailored CV & cover letter'}
          </button>
        </div>
      )}
    </div>
  )
}
