'use client'

import { useRef, useState } from 'react'
import { saveProfile } from './actions'

const INDUSTRIES = [
  'Tech / Software',
  'Fintech',
  'HealthTech',
  'E-commerce',
  'Gaming',
  'Media & Content',
  'Consulting',
  'Finance',
  'EdTech',
  'Climate / Sustainability',
  'Any industry',
]

const STAGES = [
  'Early startup (Seed–A)',
  'Growth stage (B–D)',
  'Scale-up',
  'Enterprise (500+)',
  'Public company',
  'No preference',
]

const CAREER_LEVELS = [
  'Entry level (0–2 yrs)',
  'Mid-level (3–5 yrs)',
  'Senior (5–8 yrs)',
  'Lead / Principal',
  'Manager',
  'Director',
  'VP / Head of',
  'C-Level / Founder',
]

const ARRANGEMENTS = [
  'Fully remote',
  'Remote-first hybrid',
  'Office-first hybrid',
  'On-site only',
  'Open to anything',
]

// 6 required fields for progress ring
const REQUIRED_FIELDS = ['targetRoles', 'careerLevel', 'arrangement', 'industry', 'stage', 'locations'] as const
type RequiredField = (typeof REQUIRED_FIELDS)[number]

export default function OnboardingPage() {
  const formRef = useRef<HTMLFormElement>(null)

  // Required fields state
  const [filled, setFilled] = useState<Record<RequiredField, boolean>>({
    targetRoles: false,
    careerLevel: false,
    arrangement: false,
    industry: false,
    stage: false,
    locations: false,
  })

  // Chip selections
  const [industries, setIndustries] = useState<string[]>([])
  const [stages, setStages] = useState<string[]>([])

  // File states
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [liPdfFile, setLiPdfFile] = useState<File | null>(null)

  const [cvDrag, setCvDrag] = useState(false)
  const [photoDrag, setPhotoDrag] = useState(false)
  const [liDrag, setLiDrag] = useState(false)

  const [pending, setPending] = useState(false)

  const completedCount = Object.values(filled).filter(Boolean).length
  const circumference = 2 * Math.PI * 13 // r=13
  const dashOffset = circumference * (1 - completedCount / REQUIRED_FIELDS.length)

  function mark(field: RequiredField, hasValue: boolean) {
    setFilled((prev) => ({ ...prev, [field]: hasValue }))
  }

  function toggleChip(value: string, list: string[], setter: (v: string[]) => void, field: RequiredField) {
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    setter(next)
    mark(field, next.length > 0)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('preferredIndustries', JSON.stringify(industries))
    fd.set('companyStages', JSON.stringify(stages))
    if (cvFile) fd.set('cv', cvFile)
    if (photoFile) fd.set('photoFileName', photoFile.name)
    if (liPdfFile) fd.set('linkedinPdfName', liPdfFile.name)
    await saveProfile(fd)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 100px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '40px 0 28px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 10 }}>
          Step 2 of 3 · Profile Setup
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1.15, color: '#1A1917', marginBottom: 8 }}>
          Tell Claude about you
        </h1>
        <p style={{ fontSize: 14, color: '#6B6660' }}>
          Takes about 5 minutes. Claude uses this on every CV and cover letter it generates.
        </p>
      </div>

      {/* Steps indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {[
          { n: '✓', label: 'App config', done: true, active: false },
          { n: '2', label: 'Your profile', done: false, active: true },
          { n: '3', label: 'Generate CV', done: false, active: false },
        ].map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {i > 0 && <span style={{ flex: 1, height: 1, background: '#D9D6CE', margin: '0 10px', width: 48, display: 'inline-block' }} />}
            <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 500, color: s.done ? '#14532D' : s.active ? '#2362D4' : '#A8A29E' }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${s.done ? '#14532D' : s.active ? '#2362D4' : '#A8A29E'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                background: s.done ? '#14532D' : s.active ? '#2362D4' : 'transparent',
                color: s.done || s.active ? '#fff' : '#A8A29E',
              }}>{s.n}</span>
              {s.label}
            </span>
          </span>
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>

        {/* ── CARD: Photo ─────────────────────────────── */}
        <Card icon="🪪" title="Profile photo" subtitle="Used on your generated CVs" badge="Optional">
          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            file={photoFile}
            onFile={(f) => setPhotoFile(f)}
            onRemove={() => setPhotoFile(null)}
            isDragging={photoDrag}
            onDragOver={() => setPhotoDrag(true)}
            onDragLeave={() => setPhotoDrag(false)}
            label="Drop your photo here, or click to browse"
            sub="Square works best — at least 300×300 px"
            types={['.jpg', '.png', '.webp']}
            icon="🖼️"
          />
        </Card>

        {/* ── CARD: CV Upload ──────────────────────────── */}
        <Card icon="📄" title="Your current CV" subtitle="Claude extracts your work history, skills, and education automatically" badge="Required">
          <UploadZone
            accept=".pdf,.doc,.docx"
            file={cvFile}
            onFile={(f) => setCvFile(f)}
            onRemove={() => setCvFile(null)}
            isDragging={cvDrag}
            onDragOver={() => setCvDrag(true)}
            onDragLeave={() => setCvDrag(false)}
            label="Drop your CV here, or click to browse"
            sub="Claude will read it and extract your profile"
            types={['.pdf', '.doc', '.docx']}
            icon="📋"
          />
        </Card>

        {/* ── CARD: Preferences ────────────────────────── */}
        <Card icon="🎯" title="What you're looking for" subtitle="Used to frame your CV toward your next role, not just your last one" badge="6 questions">

          {/* Q1: Target roles */}
          <Field label="Target role(s)" hint="— free text, can't be a dropdown">
            <input
              name="targetRoles"
              type="text"
              placeholder="e.g. Senior Product Manager, Head of Growth, Director of Product"
              style={inputStyle}
              onChange={(e) => mark('targetRoles', e.target.value.trim().length > 0)}
            />
            <FieldNote>List the job titles you're actively applying for. Claude will tailor keyword density toward these.</FieldNote>
          </Field>

          <Divider />

          {/* Q2 + Q3: Level + Arrangement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Field label="Career level" style={{ marginBottom: 0 }}>
              <select
                name="careerLevel"
                style={inputStyle}
                defaultValue=""
                onChange={(e) => mark('careerLevel', e.target.value.length > 0)}
              >
                <option value="" disabled>Select your level…</option>
                {CAREER_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Work arrangement" style={{ marginBottom: 0 }}>
              <select
                name="workArrangement"
                style={inputStyle}
                defaultValue=""
                onChange={(e) => mark('arrangement', e.target.value.length > 0)}
              >
                <option value="" disabled>Select preference…</option>
                {ARRANGEMENTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
          </div>

          <Divider />

          {/* Q4: Industries */}
          <Field label="Preferred industries" hint="— pick all that apply">
            <ChipGroup
              options={INDUSTRIES}
              selected={industries}
              onToggle={(v) => toggleChip(v, industries, setIndustries, 'industry')}
            />
          </Field>

          <Divider />

          {/* Q5: Company stage */}
          <Field label="Company stage" hint="— pick all that apply">
            <ChipGroup
              options={STAGES}
              selected={stages}
              onToggle={(v) => toggleChip(v, stages, setStages, 'stage')}
            />
          </Field>

          <Divider />

          {/* Q6: Locations */}
          <Field label="Preferred locations">
            <input
              name="locations"
              type="text"
              placeholder="e.g. London, Berlin, Remote EU"
              style={inputStyle}
              onChange={(e) => mark('locations', e.target.value.trim().length > 0)}
            />
            <FieldNote>City names, regions, or "Remote" — comma-separated.</FieldNote>
          </Field>

          <Divider />

          {/* Q7: Job sections count */}
          <Field label="Jobs to show on CV" hint="— how many roles from your history?" style={{ marginBottom: 0 }}>
            <select name="jobSectionsCount" style={inputStyle} defaultValue="3">
              <option value="2">2 jobs</option>
              <option value="3">3 jobs (recommended)</option>
              <option value="4">4 jobs</option>
              <option value="5">5 jobs</option>
              <option value="6">6 jobs</option>
            </select>
            <FieldNote>Each job becomes a tailored section on your CV. More jobs = longer generation time.</FieldNote>
          </Field>

        </Card>

        {/* ── CARD: LinkedIn ────────────────────────────── */}
        <Card icon="🔗" title="Paste from LinkedIn" subtitle="Captures your voice and keyword profile — things a CV alone misses" badge="Optional">

          {/* LinkedIn PDF */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A66C2', background: '#EAF3FC', borderRadius: 3, padding: '1px 6px' }}>PDF</span>
                Upload your profile export
              </span>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>
                Profile → More··· → Save to PDF
              </span>
            </div>
            <UploadZone
              accept=".pdf"
              file={liPdfFile}
              onFile={(f) => setLiPdfFile(f)}
              onRemove={() => setLiPdfFile(null)}
              isDragging={liDrag}
              onDragOver={() => setLiDrag(true)}
              onDragLeave={() => setLiDrag(false)}
              label="Drop your LinkedIn PDF here, or click to browse"
              sub="Gets your full profile — experience, education, skills, and About in one file"
              types={['.pdf']}
              icon="🔗"
              compact
            />
            <p style={{ fontSize: 12, color: '#A8A29E', marginTop: 6, fontStyle: 'italic' }}>
              On LinkedIn: click your profile → <strong style={{ fontStyle: 'normal' }}>More···</strong> button below your name → <strong style={{ fontStyle: 'normal' }}>Save to PDF</strong>.
            </p>
          </div>

          <OrDivider />

          {/* About */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A66C2', background: '#EAF3FC', borderRadius: 3, padding: '1px 6px' }}>About</span>
                Your summary paragraph
              </span>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>Profile → About → see more → copy all</span>
            </div>
            <textarea
              name="linkedinAbout"
              rows={5}
              placeholder={"Paste your LinkedIn About section here…\n\nThis is your personal brand statement — the 3–8 sentences that describe who you are and what you bring."}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <Divider />

          {/* Skills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A66C2', background: '#EAF3FC', borderRadius: 3, padding: '1px 6px' }}>Skills</span>
                Your endorsed skill tags
              </span>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>Profile → Skills → Show all → copy names</span>
            </div>
            <textarea
              name="linkedinSkills"
              rows={3}
              placeholder={"Product Strategy, Roadmapping, SQL, A/B Testing, Stakeholder Management, Agile, OKRs…\n\nPaste skill names — comma-separated or one per line."}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <p style={{ fontSize: 12, color: '#A8A29E', marginTop: 5, fontStyle: 'italic' }}>
              LinkedIn skills are SEO-optimized for recruiter searches — Claude uses both your CV and these tags for ATS matching.
            </p>
          </div>

        </Card>

      </form>

      {/* ── Save bar ──────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#F8F7F4', borderTop: '1px solid #D9D6CE',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, zIndex: 50,
        boxShadow: '0 -4px 16px rgba(0,0,0,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Progress ring */}
          <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="16" cy="16" r="13" fill="none" stroke="#D9D6CE" strokeWidth="3" />
            <circle
              cx="16" cy="16" r="13" fill="none"
              stroke={completedCount === REQUIRED_FIELDS.length ? '#14532D' : '#2362D4'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s' }}
            />
          </svg>
          <div style={{ fontSize: 12.5, color: '#6B6660' }}>
            <strong style={{ color: '#1A1917' }}>{completedCount} of {REQUIRED_FIELDS.length}</strong> required questions answered
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
            style={{ background: 'transparent', border: '1.5px solid #D9D6CE', color: '#6B6660', padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Fill in later
          </button>
          <button
            type="submit"
            form=""
            disabled={pending}
            onClick={() => formRef.current?.requestSubmit()}
            style={{
              background: pending ? '#93AEDE' : '#2362D4',
              color: '#fff', border: 'none',
              padding: '9px 20px', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {pending ? 'Saving…' : 'Save & continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function Card({
  icon, title, subtitle, badge, children,
}: {
  icon: string
  title: string
  subtitle: string
  badge: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12,
      marginBottom: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)',
    }}>
      <div style={{
        padding: '20px 24px 18px', borderBottom: '1px solid #D9D6CE',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: '#EBF0FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontFamily: 'Georgia, serif', color: '#1A1917' }}>{title}</div>
          <div style={{ fontSize: 12.5, color: '#6B6660', marginTop: 1 }}>{subtitle}</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
          background: '#EBF0FC', color: '#2362D4',
        }}>
          {badge}
        </span>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  )
}

function UploadZone({
  accept, file, onFile, onRemove,
  isDragging, onDragOver, onDragLeave,
  label, sub, types, icon, compact,
}: {
  accept: string
  file: File | null
  onFile: (f: File) => void
  onRemove: () => void
  isDragging: boolean
  onDragOver: () => void
  onDragLeave: () => void
  label: string
  sub: string
  types: string[]
  icon: string
  compact?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  if (file) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderRadius: 8,
        background: '#F0FDF4', border: '1px solid #BBF7D0',
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>{file.name}</div>
          <div style={{ fontSize: 12, color: '#14532D', marginTop: 2 }}>✓ Text will be extracted on save — Claude uses this for every generation</div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', fontSize: 16, padding: 4, borderRadius: 4 }}
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); onDragOver() }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault()
        onDragLeave()
        const f = e.dataTransfer.files[0]
        if (f) onFile(f)
      }}
      style={{
        border: `2px dashed ${isDragging ? '#2362D4' : '#D9D6CE'}`,
        borderRadius: 8,
        padding: compact ? '18px 20px' : '28px 20px',
        textAlign: 'center', cursor: 'pointer',
        background: isDragging ? '#EBF0FC' : 'transparent',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
        }}
      />
      {!compact && <div style={{ fontSize: 26, marginBottom: 8 }}>⬆️</div>}
      <div style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: '#1A1917', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#6B6660', marginBottom: 8 }}>{sub}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {types.map((t) => (
          <span key={t} style={{ fontSize: 11, fontWeight: 600, background: '#EDEAE4', border: '1px solid #D9D6CE', borderRadius: 4, padding: '2px 8px', color: '#A8A29E', fontFamily: 'monospace' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const on = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 13px', border: `1.5px solid ${on ? '#2362D4' : '#D9D6CE'}`,
              borderRadius: 100, background: on ? '#EBF0FC' : '#F8F7F4',
              color: on ? '#2362D4' : '#6B6660', fontSize: 13, fontWeight: on ? 600 : 500,
              cursor: 'pointer', transition: 'all 0.12s', userSelect: 'none',
            }}
          >
            {on && <span style={{ fontSize: 11 }}>✓</span>}
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, hint, children, style }: { label: string; hint?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: 24, ...style }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1A1917', marginBottom: 6 }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: '#A8A29E', marginLeft: 5 }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function FieldNote({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 12, color: '#A8A29E', marginTop: 5, lineHeight: 1.4 }}>{children}</p>
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid #E8E5DF', margin: '0 0 24px' }} />
}

function OrDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', fontSize: 12, fontWeight: 500, color: '#A8A29E' }}>
      <div style={{ flex: 1, height: 1, background: '#E8E5DF' }} />
      or paste specific sections manually
      <div style={{ flex: 1, height: 1, background: '#E8E5DF' }} />
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #D9D6CE',
  borderRadius: 8,
  background: '#F8F7F4',
  color: '#1A1917',
  fontFamily: 'system-ui, sans-serif',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}
