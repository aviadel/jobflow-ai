'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { updateProfile } from '../onboarding/actions'
import type { UserProfile } from '@/lib/db/types'

const INDUSTRIES = [
  'Tech / Software', 'Fintech', 'HealthTech', 'E-commerce', 'Gaming',
  'Media & Content', 'Consulting', 'Finance', 'EdTech', 'Climate / Sustainability', 'Any industry',
]
const STAGES = [
  'Early startup (Seed–A)', 'Growth stage (B–D)', 'Scale-up',
  'Enterprise (500+)', 'Public company', 'No preference',
]
const CAREER_LEVELS = [
  'Entry level (0–2 yrs)', 'Mid-level (3–5 yrs)', 'Senior (5–8 yrs)',
  'Lead / Principal', 'Manager', 'Director', 'VP / Head of', 'C-Level / Founder',
]
const ARRANGEMENTS = [
  'Fully remote', 'Remote-first hybrid', 'Office-first hybrid', 'On-site only', 'Open to anything',
]

export function ProfileClient({ profile }: { profile: UserProfile | null }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)

  const [industries, setIndustries] = useState<string[]>(profile?.preferredIndustries ?? [])
  const [stages, setStages] = useState<string[]>(profile?.companyStages ?? [])

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoData, setPhotoData] = useState<string | null>(profile?.photoData ?? null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [photoDrag, setPhotoDrag] = useState(false)
  const [cvDrag, setCvDrag] = useState(false)
  const [liPdfFile, setLiPdfFile] = useState<File | null>(null)
  const [liDrag, setLiDrag] = useState(false)
  const [cvWithPhoto, setCvWithPhoto] = useState<boolean>(profile?.cvWithPhoto ?? true)

  async function downscalePhoto(file: File): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const size = 200
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        URL.revokeObjectURL(url)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = url
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    fd.set('preferredIndustries', JSON.stringify(industries))
    fd.set('companyStages', JSON.stringify(stages))
    if (cvFile) fd.set('cv', cvFile)
    if (photoFile) fd.set('photoFileName', photoFile.name)
    if (photoData) fd.set('photoData', photoData)
    fd.set('cvWithPhoto', String(cvWithPhoto))
    if (liPdfFile) fd.set('linkedinPdfName', liPdfFile.name)
    await updateProfile(fd)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px 100px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '36px 0 24px' }}>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6B6660', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          ← Dashboard
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, lineHeight: 1.15, color: '#1A1917', marginBottom: 6 }}>
          Your profile
        </h1>
        <p style={{ fontSize: 14, color: '#6B6660' }}>
          Changes here apply to all future CV and cover letter generations.
        </p>
      </div>

      <style>{RESPONSIVE}</style>
      <form ref={formRef} onSubmit={handleSubmit}>

        {/* Contact */}
        <Card icon="📋" title="Contact details" subtitle="Appears at the top of your generated CV" badge="Optional">
          <Field label="Full name">
            <input name="name" type="text" defaultValue={profile?.name ?? ''} placeholder="e.g. Aviad Elisha" style={inputStyle} />
          </Field>
          <div className="jf-two-col">
            <Field label="Email" style={{ marginBottom: 0 }}>
              <input name="email" type="email" defaultValue={profile?.email ?? ''} placeholder="aviad@example.com" style={inputStyle} />
            </Field>
            <Field label="Phone" style={{ marginBottom: 0 }}>
              <input name="phone" type="tel" defaultValue={profile?.phone ?? ''} placeholder="+972 50 000 0000" style={inputStyle} />
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="City &amp; country" style={{ marginBottom: 0 }}>
              <input name="city" type="text" defaultValue={profile?.city ?? ''} placeholder="e.g. Tel Aviv, Israel" style={inputStyle} />
              <FieldNote>City and country only - no street address needed.</FieldNote>
            </Field>
          </div>
        </Card>

        {/* Photo */}
        <Card icon="🪪" title="Profile photo" subtitle="Used on your generated CVs" badge="Optional">
          <UploadZone
            accept="image/png,image/jpeg,image/webp"
            file={photoFile}
            existingPreview={profile?.photoData ?? undefined}
            onFile={async (f) => {
              setPhotoFile(f)
              const data = await downscalePhoto(f)
              setPhotoData(data)
            }}
            onRemove={() => { setPhotoFile(null); setPhotoData(null) }}
            isDragging={photoDrag}
            onDragOver={() => setPhotoDrag(true)}
            onDragLeave={() => setPhotoDrag(false)}
            label="Drop your photo here, or click to browse"
            sub="Square works best - at least 300x300 px"
            types={['.jpg', '.png', '.webp']}
            icon="🖼️"
            preview={photoData ?? undefined}
          />
          {(photoFile || profile?.photoData) && (
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1917', display: 'block', marginBottom: 10 }}>
                CV template
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { value: true, label: 'With photo', desc: 'Photo in top-right corner' },
                  { value: false, label: 'Without photo', desc: 'Clean text-only layout' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setCvWithPhoto(value)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `2px solid ${cvWithPhoto === value ? '#2362D4' : '#D9D6CE'}`,
                      background: cvWithPhoto === value ? '#EBF0FC' : '#F8F7F4',
                      textAlign: 'left', transition: 'all 0.12s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: cvWithPhoto === value ? '#2362D4' : '#1A1917' }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#6B6660', marginTop: 2 }}>{desc}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#A8A29E', marginTop: 8 }}>
                Israeli market typically prefers without photo. European market often includes one.
              </p>
            </div>
          )}
        </Card>

        {/* CV */}
        <Card icon="📄" title="Your current CV" subtitle="Claude extracts your work history, skills, and education automatically" badge={profile?.cvFileName ? 'Uploaded' : 'Required'}>
          {profile?.cvFileName && !cvFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, marginBottom: 12, fontSize: 13 }}>
              <span>📋</span>
              <span style={{ flex: 1, color: '#14532D', fontWeight: 500 }}>{profile.cvFileName}</span>
              <span style={{ color: '#6B6660', fontSize: 12 }}>Upload a new file to replace</span>
            </div>
          )}
          <UploadZone
            accept=".pdf,.doc,.docx"
            file={cvFile}
            onFile={(f) => setCvFile(f)}
            onRemove={() => setCvFile(null)}
            isDragging={cvDrag}
            onDragOver={() => setCvDrag(true)}
            onDragLeave={() => setCvDrag(false)}
            label={profile?.cvFileName ? 'Drop a new CV to replace the existing one' : 'Drop your CV here, or click to browse'}
            sub="Claude will read it and extract your profile"
            types={['.pdf', '.doc', '.docx']}
            icon="📋"
          />
        </Card>

        {/* Preferences */}
        <Card icon="🎯" title="What you're looking for" subtitle="Used to frame your CV toward your next role, not just your last one" badge="6 questions">
          <Field label="Target role(s)" hint="- free text">
            <input
              name="targetRoles"
              type="text"
              defaultValue={profile?.targetRoles?.join(', ') ?? ''}
              placeholder="e.g. Senior Product Manager, Head of Growth"
              style={inputStyle}
            />
          </Field>
          <Divider />
          <div className="jf-two-col">
            <Field label="Career level" style={{ marginBottom: 0 }}>
              <select name="careerLevel" style={inputStyle} defaultValue={profile?.careerLevel ?? ''}>
                <option value="" disabled>Select your level...</option>
                {CAREER_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Work arrangement" style={{ marginBottom: 0 }}>
              <select name="workArrangement" style={inputStyle} defaultValue={profile?.workArrangement ?? ''}>
                <option value="" disabled>Select preference...</option>
                {ARRANGEMENTS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </Field>
          </div>
          <Divider />
          <Field label="Preferred industries" hint="- pick all that apply">
            <ChipGroup options={INDUSTRIES} selected={industries} onToggle={(v) => {
              setIndustries(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
            }} />
          </Field>
          <Divider />
          <Field label="Company stage" hint="- pick all that apply">
            <ChipGroup options={STAGES} selected={stages} onToggle={(v) => {
              setStages(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
            }} />
          </Field>
          <Divider />
          <Field label="Preferred locations">
            <input
              name="locations"
              type="text"
              defaultValue={profile?.locations?.join(', ') ?? ''}
              placeholder="e.g. London, Berlin, Remote EU"
              style={inputStyle}
            />
          </Field>
          <Divider />
          <Field label="Jobs to show on CV" hint="- how many roles from your history?" style={{ marginBottom: 0 }}>
            <select name="jobSectionsCount" style={inputStyle} defaultValue={String(profile?.jobSectionsCount ?? 3)}>
              <option value="2">2 jobs</option>
              <option value="3">3 jobs (recommended)</option>
              <option value="4">4 jobs</option>
              <option value="5">5 jobs</option>
              <option value="6">6 jobs</option>
            </select>
          </Field>
        </Card>

        {/* LinkedIn */}
        <Card icon="🔗" title="LinkedIn content" subtitle="Captures your voice and keyword profile" badge="Optional">
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0A66C2', background: '#EAF3FC', borderRadius: 3, padding: '1px 6px' }}>PDF</span>
                LinkedIn profile export
              </span>
              <span style={{ fontSize: 11, color: '#A8A29E' }}>Profile → More... → Save to PDF</span>
            </div>
            {profile?.linkedinPdfName && !liPdfFile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, marginBottom: 8, fontSize: 12, color: '#14532D' }}>
                <span>🔗</span><span style={{ flex: 1 }}>{profile.linkedinPdfName}</span>
                <span style={{ color: '#6B6660' }}>Upload to replace</span>
              </div>
            )}
            <UploadZone
              accept=".pdf"
              file={liPdfFile}
              onFile={(f) => setLiPdfFile(f)}
              onRemove={() => setLiPdfFile(null)}
              isDragging={liDrag}
              onDragOver={() => setLiDrag(true)}
              onDragLeave={() => setLiDrag(false)}
              label="Drop your LinkedIn PDF here, or click to browse"
              sub="Your full profile - experience, education, skills, and About in one file"
              types={['.pdf']}
              icon="🔗"
              compact
            />
          </div>
          <Divider />
          <Field label="LinkedIn About">
            <textarea
              name="linkedinAbout"
              rows={5}
              defaultValue={profile?.linkedinAbout ?? ''}
              placeholder="Paste your LinkedIn About section here..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
          <Divider />
          <Field label="LinkedIn Skills" style={{ marginBottom: 0 }}>
            <textarea
              name="linkedinSkills"
              rows={3}
              defaultValue={profile?.linkedinSkills ?? ''}
              placeholder="Product Strategy, Roadmapping, SQL, A/B Testing..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
        </Card>

      </form>

      {/* Save bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#F8F7F4', borderTop: '1px solid #D9D6CE',
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, zIndex: 50,
        boxShadow: '0 -4px 16px rgba(0,0,0,.06)',
      }}>
        <div style={{ fontSize: 13, color: saved ? '#14532D' : '#6B6660' }}>
          {saved ? '✓ Profile saved' : 'Changes take effect on the next CV you generate.'}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/dashboard"
            style={{ background: 'transparent', border: '1.5px solid #D9D6CE', color: '#6B6660', padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
          >
            Cancel
          </Link>
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
            }}
          >
            {pending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function Card({ icon, title, subtitle, badge, children }: {
  icon: string; title: string; subtitle: string; badge: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12, marginBottom: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid #D9D6CE', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: '#EBF0FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontFamily: 'Georgia, serif', color: '#1A1917' }}>{title}</div>
          <div style={{ fontSize: 12.5, color: '#6B6660', marginTop: 1 }}>{subtitle}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#EBF0FC', color: '#2362D4' }}>
          {badge}
        </span>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  )
}

function UploadZone({ accept, file, onFile, onRemove, isDragging, onDragOver, onDragLeave, label, sub, types, icon, compact, preview, existingPreview }: {
  accept: string; file: File | null; onFile: (f: File) => void; onRemove: () => void
  isDragging: boolean; onDragOver: () => void; onDragLeave: () => void
  label: string; sub: string; types: string[]; icon: string; compact?: boolean
  preview?: string; existingPreview?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const displayPreview = preview ?? existingPreview

  if (file) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 8, background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
        {displayPreview
          ? <img src={displayPreview} alt="Profile photo" style={{ width: 48, height: 48, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
          : <span style={{ fontSize: 20 }}>{icon}</span>
        }
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>{file.name}</div>
          <div style={{ fontSize: 12, color: '#14532D', marginTop: 2 }}>
            {displayPreview ? '✓ Photo will be included in your CV' : '✓ Text will be extracted on save - Claude uses this for every generation'}
          </div>
        </div>
        <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A8A29E', fontSize: 16, padding: 4 }}>✕</button>
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); onDragOver() }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDragLeave(); const f = e.dataTransfer.files[0]; if (f) onFile(f) }}
      style={{ border: `2px dashed ${isDragging ? '#2362D4' : '#D9D6CE'}`, borderRadius: 8, padding: compact ? '18px 20px' : '28px 20px', textAlign: 'center', cursor: 'pointer', background: isDragging ? '#EBF0FC' : 'transparent', transition: 'all 0.15s' }}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      {!compact && <div style={{ fontSize: 26, marginBottom: 8 }}>⬆️</div>}
      <div style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: '#1A1917', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#6B6660', marginBottom: 8 }}>{sub}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {types.map(t => <span key={t} style={{ fontSize: 11, fontWeight: 600, background: '#EDEAE4', border: '1px solid #D9D6CE', borderRadius: 4, padding: '2px 8px', color: '#A8A29E', fontFamily: 'monospace' }}>{t}</span>)}
      </div>
    </div>
  )
}

function ChipGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const on = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => onToggle(opt)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 13px', border: `1.5px solid ${on ? '#2362D4' : '#D9D6CE'}`, borderRadius: 100, background: on ? '#EBF0FC' : '#F8F7F4', color: on ? '#2362D4' : '#6B6660', fontSize: 13, fontWeight: on ? 600 : 500, cursor: 'pointer', userSelect: 'none' }}>
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

const RESPONSIVE = `
  .jf-two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
  @media(max-width:520px){ .jf-two-col { grid-template-columns:1fr; } }
`

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #D9D6CE', borderRadius: 8,
  background: '#F8F7F4', color: '#1A1917', fontFamily: 'system-ui, sans-serif', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
}
