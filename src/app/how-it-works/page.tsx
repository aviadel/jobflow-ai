import Link from 'next/link'

export const metadata = {
  title: 'How it works - JobFlow',
  description: 'Step-by-step guide to using every JobFlow feature.',
}

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
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <span style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
        background: SURFACE, border: `1px solid ${BORDER2}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-geist-mono), monospace', fontSize: 10.5,
        fontWeight: 600, color: MUTED, marginTop: 1,
      }}>{n}</span>
      <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(68,147,248,.08)', border: `1px solid rgba(68,147,248,.2)`,
      borderRadius: 6, padding: '10px 14px', fontSize: 13, color: ACCENT, lineHeight: 1.65,
    }}>
      {children}
    </div>
  )
}

function Path({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12,
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
      padding: '1px 6px', color: TEXT,
    }}>{children}</code>
  )
}

function ProBadge() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
      color: PURPLE, background: 'rgba(163,113,247,.15)', borderRadius: 4,
      padding: '1px 6px', border: '1px solid rgba(163,113,247,.25)', verticalAlign: 'middle',
      marginLeft: 8,
    }}>Pro</span>
  )
}

function Feature({
  icon, title, path, steps, tip, pro,
}: {
  icon: string
  title: string
  path: string
  steps: React.ReactNode[]
  tip?: React.ReactNode
  pro?: boolean
}) {
  return (
    <section style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 48, marginTop: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <h2 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', color: TEXT, margin: 0 }}>
          {title}{pro && <ProBadge />}
        </h2>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Path>{path}</Path>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((s, i) => <Step key={i} n={i + 1}>{s}</Step>)}
        {tip && <Tip>{tip}</Tip>}
      </div>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: BG, minHeight: '100vh', color: TEXT }}>

      {/* Nav */}
      <nav style={{ maxWidth: 820, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          {LOGO}
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, letterSpacing: '-.01em' }}>JobFlow</span>
        </Link>
        <Link
          href="/#pricing"
          style={{ fontSize: 13, fontWeight: 500, color: TEXT, textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER2}`, borderRadius: 6 }}
        >
          Get JobFlow
        </Link>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '64px 32px 96px' }}>

        {/* Page header */}
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
          Usage guide
        </p>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 12 }}>
          How it works
        </h1>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 480, lineHeight: 1.65, marginBottom: 56 }}>
          Step-by-step instructions for every feature. New here? Start at <Path>/onboarding</Path>. To update your profile later, go to <Path>/profile</Path>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          <Feature
            icon="🔍"
            title="JD Decode"
            path="/new"
            steps={[
              <>Open <Path>/new</Path>. You will see two input modes: <strong style={{ color: TEXT }}>Paste URL</strong> and <strong style={{ color: TEXT }}>Paste JD text</strong>.</>,
              <><strong style={{ color: TEXT }}>URL mode (faster):</strong> paste the job posting link and click <strong style={{ color: TEXT }}>Analyze JD</strong>. JobFlow fetches the page and extracts the role, requirements, nice-to-haves, and a fit verdict against your profile.</>,
              <><strong style={{ color: TEXT }}>If the URL fails</strong> - some platforms (Workday, Greenhouse, Lever, LinkedIn Easy Apply) block automated access. If you see an error, switch to <strong style={{ color: TEXT }}>Paste JD text</strong>, copy the full job description text from the platform manually, paste it into the box, and click <strong style={{ color: TEXT }}>Analyze JD</strong> again.</>,
              <>Review the decoded summary. The fit verdict tells you how well your background matches before you commit time to a full application.</>,
              <>If the role looks good, proceed to Generate CV. The analysis result is already loaded and will be used automatically.</>,
            ]}
            tip="When copy-pasting text, include everything visible on the job page: title, responsibilities, requirements, and any nice-to-haves. More text gives a better fit verdict and a more targeted CV."
          />

          <Feature
            icon="📄"
            title="CV generation"
            path="/new"
            steps={[
              <>After decoding a JD, click <strong style={{ color: TEXT }}>Generate CV</strong>. JobFlow writes each section of your CV tailored to that specific role.</>,
              <>Once generated, review each section. If a section does not read well, click <strong style={{ color: TEXT }}>Regenerate</strong> on that section to get a new version without touching the others.</>,
              <>Add optional instructions in the section prompt field before regenerating - for example &quot;emphasise team leadership&quot; or &quot;mention the fintech context&quot;.</>,
              <>When satisfied, click <strong style={{ color: TEXT }}>Download .docx</strong> to get the final CV file, ready to submit.</>,
              <>The application is auto-saved to your tracker at <Path>/tracker</Path>.</>,
            ]}
            tip="Each section regenerates independently - you do not need to redo the whole CV to fix one paragraph."
          />

          <Feature
            icon="✉️"
            title="Cover letters"
            path="/new → Cover letter tab"
            steps={[
              <>After generating a CV, switch to the <strong style={{ color: TEXT }}>Cover letter</strong> tab on the same page. A draft is already written based on the same JD decode.</>,
              <>Read through the letter. It is structured as: opening hook, why this role, why you, closing call to action.</>,
              <>To rewrite a paragraph, click <strong style={{ color: TEXT }}>Regenerate</strong> next to it. Add instructions in the prompt field to adjust the tone or focus - for example &quot;more formal&quot; or &quot;highlight the startup experience&quot;.</>,
              <>Download as .docx when done. The cover letter is saved alongside the CV in your tracker entry.</>,
            ]}
            tip="The cover letter uses the same JD decode as the CV. Decode once, get both documents."
          />

          <Feature
            icon="📊"
            title="Application tracker"
            path="/tracker"
            steps={[
              <>Every CV you generate is automatically added to the tracker. You do not need to do anything - it happens on generation.</>,
              <>Open an entry to update its status: <strong style={{ color: TEXT }}>Applied, Screening, Interview, Offer, Rejected</strong>. Keep this current so your history stays useful.</>,
              <>Add notes to any entry - interview feedback, recruiter name, follow-up date, anything you want to remember about this application.</>,
              <>Click through to re-open the generated CV or cover letter for that application at any time.</>,
            ]}
            tip="Tracker data is stored in your own database. With Postgres configured (recommended - free on Vercel), all your applications persist permanently. Without it, data is temporary and may be lost when the server restarts. Set DATA_PROVIDER=postgres in your Vercel environment variables to enable persistent storage."
          />

          <Feature
            icon="🔬"
            title="Resume audit"
            path="/audit"
            pro
            steps={[
              <>Go to <Path>/audit</Path>. JobFlow scores your current profile CV for ATS (applicant tracking system) compatibility.</>,
              <>Review the keyword gap analysis - it compares your profile against the target roles you set at <Path>/profile</Path>.</>,
              <>Fix the flagged issues: go to <Path>/profile</Path>, update the relevant sections (skills, experience bullets, summary), then save.</>,
              <>Come back to <Path>/audit</Path> and re-run the audit to see your updated score.</>,
            ]}
            tip="Run the audit after completing your profile, and again after any major profile update. Target a score above 75 before applying to competitive roles."
          />

          <Feature
            icon="💬"
            title="Application Q&A"
            path="/tracker → open application → Q&A tab"
            pro
            steps={[
              <>Open an application from the tracker and go to the <strong style={{ color: TEXT }}>Q&A</strong> tab. Or start from <Path>/new</Path> and switch to the Q&A tab after generating.</>,
              <>Paste between 1 and 4 free-text questions from the application form. These are the open-ended questions employers ask alongside the CV submission.</>,
              <>Click <strong style={{ color: TEXT }}>Generate answers</strong>. Claude writes responses in your voice, drawing from both your profile and the JD decode for that application.</>,
              <>Edit each answer directly in the text field. They are pre-filled but yours to adjust - treat them as a strong first draft.</>,
              <>Copy and paste each answer into the application form. They are not automatically submitted anywhere.</>,
            ]}
            tip="Paste the questions exactly as written in the form - spelling, punctuation, and all. Claude uses the phrasing to calibrate tone and length."
          />

        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 72, paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}>← Back to home</Link>
          <Link href="/#pricing" style={{ fontSize: 13, color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>Get JobFlow →</Link>
        </div>

      </div>
    </div>
  )
}
