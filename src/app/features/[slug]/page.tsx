import Link from 'next/link'
import { notFound } from 'next/navigation'

const BG      = '#0d1117'
const SURFACE = '#161b22'
const BORDER  = '#21262d'
const BORDER2 = '#30363d'
const TEXT    = '#e6edf3'
const MUTED   = '#7d8590'
const ACCENT  = '#4493f8'
const GREEN   = '#3fb950'
const PURPLE  = '#a371f7'

const LOGO = (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="7" fill={SURFACE}/>
    <circle cx="8.5" cy="16" r="3" fill={GREEN}/>
    <circle cx="23.5" cy="9" r="3" fill={GREEN}/>
    <circle cx="23.5" cy="23" r="3" fill={GREEN}/>
    <line x1="11.5" y1="14.5" x2="20" y2="10.5" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round"/>
    <polygon points="21,9.7 22.5,9 21.3,10.7" fill={GREEN}/>
    <line x1="11.5" y1="17.5" x2="20" y2="21.5" stroke={GREEN} strokeWidth="1.6" strokeLinecap="round"/>
    <polygon points="21,22.3 22.5,23 21.3,21.3" fill={GREEN}/>
  </svg>
)

type Feature = {
  slug: string
  icon: string
  title: string
  tagline: string
  pro: boolean
  paragraphs: string[]
  badges: string[]
  comingSoon: string[]
  mock: React.ReactNode
}

// ── Shell components ──────────────────────────────────────────────────────────

const NAV_ITEMS = ['Dashboard', 'Applications', 'JD Decode', 'Tracker', 'Career tools']

function ShellSidebar({ active }: { active: string }) {
  return (
    <div style={{ width: '28%', background: '#111520', borderRight: '1px solid rgba(255,255,255,.06)', padding: 10, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', marginBottom: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'conic-gradient(from 135deg,#2E7BD6 0deg 180deg,#1FAE8E 180deg 360deg)', flexShrink: 0 }} />
        <span style={{ fontSize: 7.5, fontWeight: 700, color: '#E2E8F2' }}>JobFlow</span>
      </div>
      {NAV_ITEMS.map(item => (
        <div key={item} style={{
          padding: '4px 6px', borderRadius: 4, marginBottom: 2,
          fontSize: 6.5, fontWeight: item === active ? 600 : 400,
          background: item === active ? 'rgba(88,174,255,.15)' : 'transparent',
          color: item === active ? '#7DB0FF' : '#5A6278',
        }}>{item}</div>
      ))}
    </div>
  )
}

function Shell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
      overflow: 'hidden', aspectRatio: '16/11', display: 'flex',
      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    }}>
      <ShellSidebar active={active} />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: BG }}>
        {children}
      </div>
    </div>
  )
}

function ShellAnimated({ active, before, after }: { active: string; before: React.ReactNode; after: React.ReactNode }) {
  return (
    <Shell active={active}>
      <div style={{ position: 'absolute', inset: 0, padding: 14, animation: 'jf-pane-a 8s ease-in-out infinite' }}>{before}</div>
      <div style={{ position: 'absolute', inset: 0, padding: 14, animation: 'jf-pane-b 8s ease-in-out infinite' }}>{after}</div>
    </Shell>
  )
}

// ── Mock helpers ──────────────────────────────────────────────────────────────

const lbl = (text: string) => (
  <div style={{ fontSize: 5.5, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.07em', color: '#5A6278', marginBottom: 4 }}>{text}</div>
)
const ttl = (text: string) => (
  <div style={{ fontSize: 8.5, fontWeight: 700, color: '#F2F5F9', marginBottom: 8 }}>{text}</div>
)
function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 5, padding: '7px 8px', marginBottom: 4 }}>{children}</div>
}
function CardHeader({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
      <span style={{ fontSize: 5.5, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.05em', color: '#7DB0FF' }}>{label}</span>
      {ok && <span style={{ fontSize: 5, color: '#2DC891', fontWeight: 700 }}>✓ Approved</span>}
    </div>
  )
}
function Bar({ w, green }: { w: number; green?: boolean }) {
  return <div style={{ height: 4, background: green ? '#2DC891' : '#21262d', opacity: green ? 0.7 : 1, borderRadius: 2, width: `${w}%`, marginBottom: 2 }} />
}
function GenBtn({ label = 'Generate →' }: { label?: string }) {
  return <div style={{ display: 'inline-block', background: ACCENT, borderRadius: 4, padding: '4px 10px', fontSize: 6, fontWeight: 600, color: '#fff', animation: 'jf-click-pulse 8s ease-in-out infinite', cursor: 'default' }}>{label}</div>
}
function Tag({ text, match }: { text: string; match?: boolean }) {
  return (
    <span style={{
      fontSize: 5, padding: '1px 4px', borderRadius: 3,
      background: match ? 'rgba(63,185,80,.12)' : '#21262d',
      color: match ? '#3fb950' : '#7d8590',
      border: match ? '1px solid rgba(63,185,80,.15)' : 'none',
    }}>{text}</span>
  )
}

// ── Feature mocks ─────────────────────────────────────────────────────────────

function CvGenerationMock() {
  return (
    <ShellAnimated
      active="Applications"
      before={
        <>
          {lbl('Application · Setup')}
          {ttl('Meridian Alliance · Senior Engineer')}
          <Card>
            <CardHeader label="JD keywords" />
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3, marginBottom: 2 }}>
              {['TypeScript', 'React', 'Node.js', 'Kubernetes', 'REST APIs', 'GraphQL'].map((k, i) =>
                <Tag key={k} text={k} match={i !== 3 && i !== 5} />
              )}
            </div>
          </Card>
          <div style={{ marginTop: 8 }}><GenBtn label="Generate CV + Cover letter →" /></div>
        </>
      }
      after={
        <>
          {lbl('Application · Review')}
          {ttl('Meridian Alliance · Senior Engineer')}
          <Card><CardHeader label="Summary" ok /><Bar w={95} green /><Bar w={80} green /></Card>
          <Card><CardHeader label="Experience" ok /><Bar w={90} green /><Bar w={75} green /><Bar w={60} green /></Card>
          <Card><CardHeader label="Cover letter" ok /><Bar w={95} green /><Bar w={85} green /></Card>
        </>
      }
    />
  )
}

function CoverLetterMock() {
  return (
    <ShellAnimated
      active="Applications"
      before={
        <>
          {lbl('Application · Cover letter')}
          {ttl('Meridian Alliance · Senior Engineer')}
          <Card>
            <CardHeader label="Tone" />
            <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
              {['Professional', 'Conversational', 'Confident'].map((t, i) => (
                <span key={t} style={{ fontSize: 5.5, padding: '2px 6px', borderRadius: 3, background: i === 0 ? 'rgba(88,174,255,.2)' : '#21262d', color: i === 0 ? '#7DB0FF' : '#5A6278', border: i === 0 ? '1px solid rgba(88,174,255,.3)' : 'none' }}>{t}</span>
              ))}
            </div>
          </Card>
          <div style={{ marginTop: 8 }}><GenBtn label="Generate cover letter →" /></div>
        </>
      }
      after={
        <>
          {lbl('Application · Cover letter')}
          {ttl('Meridian Alliance · Senior Engineer')}
          <Card><CardHeader label="Opening" ok /><Bar w={95} green /><Bar w={80} green /></Card>
          <Card><CardHeader label="Body" ok /><Bar w={85} green /><Bar w={90} green /><Bar w={70} green /></Card>
          <Card><CardHeader label="Close" ok /><Bar w={75} green /><Bar w={60} green /></Card>
        </>
      }
    />
  )
}

function JdDecodeMock() {
  return (
    <ShellAnimated
      active="JD Decode"
      before={
        <>
          {lbl('JD Decode · Paste job description')}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 5, padding: '7px 8px', marginBottom: 8, minHeight: 60 }}>
            <div style={{ fontSize: 5.5, color: '#5A6278', lineHeight: 1.6 }}>
              We are looking for a Senior Software Engineer to join...
            </div>
            <Bar w={90} /><Bar w={75} /><Bar w={85} /><Bar w={50} />
          </div>
          <GenBtn label="Decode →" />
        </>
      }
      after={
        <>
          {lbl('JD Decode · Results')}
          {ttl('Senior Software Engineer · Meridian')}
          <Card>
            <CardHeader label="Fit verdict" />
            <span style={{ fontSize: 6, color: '#2DC891', fontWeight: 600 }}>Strong match - 4/5 must-haves covered</span>
          </Card>
          <Card>
            <CardHeader label="ATS keywords" />
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3 }}>
              {['TypeScript', 'React', 'Node.js', 'Kubernetes', 'REST APIs'].map((k, i) =>
                <Tag key={k} text={k} match={i < 3} />
              )}
            </div>
          </Card>
          <Card>
            <CardHeader label="Must-haves" />
            <Bar w={85} green /><Bar w={70} green /><Bar w={55} />
          </Card>
        </>
      }
    />
  )
}

function TrackerMock() {
  return (
    <ShellAnimated
      active="Tracker"
      before={
        <>
          {lbl('Application tracker')}
          <div style={{ marginBottom: 6 }}>
            {[
              { co: 'Meridian Alliance', role: 'Sr Engineer', status: 'Applied', color: '#7DB0FF', bg: 'rgba(88,174,255,.1)' },
              { co: 'Nova Labs', role: 'Lead Engineer', status: 'Applied', color: '#7DB0FF', bg: 'rgba(88,174,255,.1)' },
              { co: 'Apex Systems', role: 'Engineer', status: 'Rejected', color: '#FF6B6B', bg: 'rgba(255,107,107,.1)' },
            ].map(a => (
              <div key={a.co} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 7px', borderBottom: '1px solid #21262d', fontSize: 6 }}>
                <div>
                  <div style={{ color: '#E2E8F2', fontWeight: 600, marginBottom: 1 }}>{a.co}</div>
                  <div style={{ color: '#5A6278' }}>{a.role}</div>
                </div>
                <span style={{ fontSize: 5, padding: '2px 6px', borderRadius: 10, background: a.bg, color: a.color }}>{a.status}</span>
              </div>
            ))}
          </div>
        </>
      }
      after={
        <>
          {lbl('Application tracker')}
          <div style={{ marginBottom: 6 }}>
            {[
              { co: 'Meridian Alliance', role: 'Sr Engineer', status: 'Interview', color: '#3fb950', bg: 'rgba(63,185,80,.1)' },
              { co: 'Nova Labs', role: 'Lead Engineer', status: 'Applied', color: '#7DB0FF', bg: 'rgba(88,174,255,.1)' },
              { co: 'Apex Systems', role: 'Engineer', status: 'Rejected', color: '#FF6B6B', bg: 'rgba(255,107,107,.1)' },
            ].map(a => (
              <div key={a.co} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 7px', borderBottom: '1px solid #21262d', fontSize: 6 }}>
                <div>
                  <div style={{ color: '#E2E8F2', fontWeight: 600, marginBottom: 1 }}>{a.co}</div>
                  <div style={{ color: '#5A6278' }}>{a.role}</div>
                </div>
                <span style={{ fontSize: 5, padding: '2px 6px', borderRadius: 10, background: a.bg, color: a.color }}>{a.status}</span>
              </div>
            ))}
          </div>
          <Card>
            <CardHeader label="Meridian Alliance · Note" />
            <div style={{ fontSize: 5.5, color: '#7d8590' }}>Recruiter replied - interview Thu 10am</div>
          </Card>
        </>
      }
    />
  )
}

function AuditMock() {
  return (
    <ShellAnimated
      active="Career tools"
      before={
        <>
          {lbl('Resume audit · Ready')}
          {ttl('Meridian Alliance · Senior Engineer')}
          <Card>
            <CardHeader label="Documents" />
            <div style={{ fontSize: 6, color: '#2DC891', marginBottom: 2 }}>✓ CV attached</div>
            <div style={{ fontSize: 6, color: '#2DC891' }}>✓ Cover letter attached</div>
          </Card>
          <div style={{ marginTop: 8 }}><GenBtn label="Run audit →" /></div>
        </>
      }
      after={
        <>
          {lbl('Resume audit · Results')}
          <Card>
            <CardHeader label="ATS formatting" />
            <div style={{ fontSize: 5.5, color: '#2DC891', marginBottom: 2 }}>✓ No tables or columns detected</div>
            <div style={{ fontSize: 5.5, color: '#2DC891' }}>✓ Clean heading structure</div>
          </Card>
          <Card>
            <CardHeader label="Keyword coverage" />
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 3, marginBottom: 4 }}>
              <Tag text="TypeScript" match /><Tag text="React" match /><Tag text="Kubernetes" /><Tag text="GraphQL" />
            </div>
            <div style={{ fontSize: 5.5, color: '#E09348' }}>⚠ 2 keywords missing - add to Skills section</div>
          </Card>
        </>
      }
    />
  )
}

function QandAMock() {
  return (
    <ShellAnimated
      active="Career tools"
      before={
        <>
          {lbl('Application Q&A')}
          <Card>
            <CardHeader label="Question 1" />
            <div style={{ fontSize: 5.5, color: '#CDD5E0', lineHeight: 1.5, marginBottom: 2 }}>Why do you want to work at Meridian Alliance?</div>
          </Card>
          <Card>
            <CardHeader label="Question 2" />
            <div style={{ fontSize: 5.5, color: '#CDD5E0', lineHeight: 1.5, marginBottom: 2 }}>Describe a time you led a team under pressure.</div>
          </Card>
          <div style={{ marginTop: 8 }}><GenBtn label="Generate answers →" /></div>
        </>
      }
      after={
        <>
          {lbl('Application Q&A · Answers')}
          <Card>
            <CardHeader label="Question 1" ok />
            <Bar w={95} green /><Bar w={85} green /><Bar w={75} green />
          </Card>
          <Card>
            <CardHeader label="Question 2" ok />
            <Bar w={90} green /><Bar w={80} green /><Bar w={70} green /><Bar w={60} green />
          </Card>
        </>
      }
    />
  )
}

// ── Feature data ──────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    slug: 'cv-generation',
    icon: '📄',
    title: 'CV generation',
    tagline: 'Tailored CV per application - self-correcting AI pass, section-by-section regen until you approve.',
    pro: false,
    paragraphs: [
      'JobFlow reads the job description, extracts the key requirements, and generates a CV that leads with what this specific role cares about - not a generic template reshuffled.',
      'After the first draft, it runs a self-check pass comparing the output against the JD keywords and flags any coverage gaps before handing it back to you.',
      'Every section is independently regeneratable. Keep the intro, redo the experience bullets - without losing edits elsewhere. One click per section, custom prompt optional.',
    ],
    badges: ['Starter + Pro', 'Claude-powered', 'Instant download (.docx)'],
    comingSoon: ['PDF formatting presets', 'Google Docs export'],
    mock: <CvGenerationMock />,
  },
  {
    slug: 'cover-letters',
    icon: '✉️',
    title: 'Cover letters',
    tagline: 'Written in parallel with your CV - matches your voice, custom-prompt regen per section.',
    pro: false,
    paragraphs: [
      'The cover letter is drafted alongside your CV so both documents reference the same tailored framing and key selling points - no mismatches.',
      'JobFlow writes in an active, first-person voice that sounds like you, not a generic template. Each paragraph (intro, body, close) can be regenerated independently with a custom prompt.',
      'You stay in control of tone and content without starting from scratch every time.',
    ],
    badges: ['Starter + Pro', 'Claude-powered', 'Instant download (.docx)'],
    comingSoon: [],
    mock: <CoverLetterMock />,
  },
  {
    slug: 'jd-decode',
    icon: '🔍',
    title: 'JD Decode',
    tagline: 'Extract role requirements, ATS keywords, and a fit verdict - all in one click.',
    pro: false,
    paragraphs: [
      'Paste the job description and JobFlow extracts the must-have vs nice-to-have requirements, surfaces the ATS keywords the role is optimised for, and gives you a quick fit verdict based on your profile.',
      'The structured breakdown takes about 15 seconds and is shown before any generation starts - so you can decide whether the role is worth applying to before committing.',
      'Keywords extracted here are used automatically by the CV and cover letter generators to ensure your documents match what the ATS is scanning for.',
    ],
    badges: ['Starter + Pro', 'Claude-powered'],
    comingSoon: [],
    mock: <JdDecodeMock />,
  },
  {
    slug: 'application-tracker',
    icon: '📊',
    title: 'Application tracker',
    tagline: 'Status, notes, and full history - stored in your own instance, never shared.',
    pro: false,
    paragraphs: [
      'Every application you create is stored in your own Vercel instance. Track status (Applied, Interview, Offer, Rejected), add notes, and view a full history of generated documents per role.',
      'Nothing is sent to external servers. Your application history is yours alone, stored in the database you configured - not on our infrastructure.',
      'The tracker is the central hub: from here you can jump back into any application to regenerate a section, view the original JD, or update the status after a recruiter reply.',
    ],
    badges: ['Starter + Pro'],
    comingSoon: ['Google Sheets sync', 'Email status auto-detection'],
    mock: <TrackerMock />,
  },
  {
    slug: 'resume-audit',
    icon: '🔬',
    title: 'Resume audit',
    tagline: 'ATS compatibility check, keyword gap analysis - a final pass before you submit.',
    pro: true,
    paragraphs: [
      'Before you submit, run your tailored CV and cover letter through the audit tool. It checks ATS formatting - tables, columns, and graphics that break parsers - and flags them with specific fixes.',
      'Identifies keywords from the JD that are missing from your documents, with suggestions on where and how to work them in naturally.',
      'You get a line-by-line report with specific, actionable fixes - not vague suggestions like "improve your summary."',
    ],
    badges: ['Pro only', 'Claude-powered'],
    comingSoon: ['LinkedIn profile consistency check'],
    mock: <AuditMock />,
  },
  {
    slug: 'application-qa',
    icon: '💬',
    title: 'Application Q&A',
    tagline: 'Paste 1-4 free-text questions from the application form - Claude answers in your voice.',
    pro: true,
    paragraphs: [
      'Many applications include free-text questions like "Why do you want to work here?" or "Describe a time you led a team under pressure."',
      'Paste up to 4 questions alongside the job description and your profile, and JobFlow drafts answers that reference your actual experience - not generic platitudes pulled from the web.',
      'Each answer can be regenerated with a custom tone prompt. Get a first draft in under 30 seconds, then edit to taste.',
    ],
    badges: ['Pro only', 'Claude-powered'],
    comingSoon: [],
    mock: <QandAMock />,
  },
]

export async function generateStaticParams() {
  return FEATURES.map(f => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const f = FEATURES.find(f => f.slug === slug)
  if (!f) return {}
  return {
    title: `${f.title} - JobFlow`,
    description: f.tagline,
  }
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const idx = FEATURES.findIndex(f => f.slug === slug)
  if (idx === -1) notFound()

  const feature = FEATURES[idx]
  const prev = FEATURES[idx - 1] ?? null
  const next = FEATURES[idx + 1] ?? null

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: BG, minHeight: '100vh', color: TEXT }}>

      {/* Nav */}
      <nav style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          {LOGO}
          <span style={{ fontSize: 17, fontWeight: 600, color: TEXT, letterSpacing: '-.01em' }}>JobFlow</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {prev && (
            <Link href={`/features/${prev.slug}`} style={{ fontSize: 12, color: MUTED, textDecoration: 'none', padding: '5px 12px', border: `1px solid ${BORDER2}`, borderRadius: 6 }}>
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link href={`/features/${next.slug}`} style={{ fontSize: 12, color: MUTED, textDecoration: 'none', padding: '5px 12px', border: `1px solid ${BORDER2}`, borderRadius: 6 }}>
              {next.title} →
            </Link>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 32px 80px' }}>

        {/* Back */}
        <Link href="/#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: MUTED, textDecoration: 'none', marginBottom: 36 }}>
          ← What&apos;s included
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 48 }}>
          <div style={{ width: 56, height: 56, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, lineHeight: 1 }}>
            {feature.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, letterSpacing: '-.025em', color: TEXT, lineHeight: 1.1 }}>
                {feature.title}
              </h1>
              {feature.pro && (
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: PURPLE, background: 'rgba(163,113,247,.15)', borderRadius: 4, padding: '2px 8px', border: '1px solid rgba(163,113,247,.25)', flexShrink: 0 }}>
                  Pro
                </span>
              )}
            </div>
            <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.6, maxWidth: 560 }}>{feature.tagline}</p>
          </div>
        </div>

        {/* Body: description + mock */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 48 }}>

          <div>
            {feature.paragraphs.map((p, i) => (
              <p key={i} style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, marginBottom: 18 }}>{p}</p>
            ))}

            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, marginBottom: feature.comingSoon.length ? 28 : 0 }}>
              {feature.badges.map(b => (
                <span key={b} style={{ fontSize: 11, color: GREEN, background: 'rgba(63,185,80,.1)', border: '1px solid rgba(63,185,80,.18)', borderRadius: 5, padding: '3px 10px' }}>{b}</span>
              ))}
            </div>

            {/* Coming soon */}
            {feature.comingSoon.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>Coming soon</div>
                {feature.comingSoon.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUTED, marginBottom: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: BORDER2, flexShrink: 0, display: 'inline-block' }} />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mock */}
          <div>{feature.mock}</div>
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {prev ? (
              <Link href={`/features/${prev.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUTED, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                ← {prev.title}
              </Link>
            ) : <span />}
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {FEATURES.map((f, i) => (
              <Link key={f.slug} href={`/features/${f.slug}`} style={{ width: 7, height: 7, borderRadius: '50%', background: i === idx ? ACCENT : BORDER2, display: 'block', flexShrink: 0 }} />
            ))}
          </div>

          <div>
            {next ? (
              <Link href={`/features/${next.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: MUTED, textDecoration: 'none', padding: '8px 16px', border: `1px solid ${BORDER}`, borderRadius: 6 }}>
                {next.title} →
              </Link>
            ) : <span />}
          </div>
        </div>
      </div>
    </div>
  )
}
