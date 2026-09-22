import Link from 'next/link'

export const metadata = {
  title: 'How it works - JobFlow',
  description: 'Step-by-step guide to using every JobFlow feature.',
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
:root{
  --b:#2563EB;--bl:#3B82F6;--b50:#EFF6FF;--b100:#DBEAFE;--bd:#1E40AF;
  --am:#D97706;--aml:#FEF3C7;--pu:#7C3AED;--pul:#EDE9FE;
  --ok:#059669;--okl:#D1FAE5;
  --bg:#F8FAFC;--bg2:#F1F5F9;--ca:#FFFFFF;--bo:#CBD5E1;--bo2:#E2E8F0;
  --t1:#0F172A;--t2:#475569;--t3:#64748B;--t4:#94A3B8;
  --nb:rgba(248,250,252,0.93);
  --r1:6px;--r2:10px;--r3:16px;
  --fd:'Outfit',system-ui,sans-serif;--fb:'DM Sans',system-ui,sans-serif;
}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --b:#60A5FA;--bl:#93C5FD;--b50:#172554;--b100:#1E3A5F;
  --am:#FBBF24;--aml:#422006;--pu:#A78BFA;--pul:#2E1065;
  --ok:#34D399;--okl:#064E3B;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--t4:#475569;--nb:rgba(11,17,32,0.93);
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--bl:#93C5FD;--b50:#172554;--b100:#1E3A5F;
  --am:#FBBF24;--aml:#422006;--pu:#A78BFA;--pul:#2E1065;
  --ok:#34D399;--okl:#064E3B;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--t4:#475569;--nb:rgba(11,17,32,0.93);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--fb);background:var(--bg);color:var(--t1);-webkit-font-smoothing:antialiased;line-height:1.6}
a{color:inherit;text-decoration:none}
`

const LogoSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" fill="white"/>
    <circle cx="6" cy="12" r="3" fill="white"/>
    <circle cx="18" cy="19" r="3" fill="white"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
        background: 'var(--b50)', border: '1px solid var(--b100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: 'var(--b)', marginTop: 2,
      }}>{n}</span>
      <p style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.75, margin: 0 }}>{children}</p>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--b50)', border: '1px solid var(--b100)',
      borderRadius: 'var(--r1)', padding: '10px 14px',
      fontSize: 13, color: 'var(--b)', lineHeight: 1.65,
    }}>
      {children}
    </div>
  )
}

function Path({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'ui-monospace,monospace', fontSize: 12.5,
      background: 'var(--bg2)', border: '1px solid var(--bo)', borderRadius: 4,
      padding: '1px 6px', color: 'var(--t1)',
    }}>{children}</code>
  )
}

function ProBadge() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.05em',
      textTransform: 'uppercase' as const,
      color: 'var(--pu)', background: 'var(--pul)', borderRadius: 4,
      padding: '1px 6px', border: '1px solid rgba(124,58,237,.25)',
      verticalAlign: 'middle', marginLeft: 8,
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
    <section style={{ borderTop: '1px solid var(--bo)', paddingTop: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 'var(--r1)',
          background: 'var(--b50)', border: '1px solid var(--b100)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{icon}</span>
        <h2 style={{
          fontFamily: 'var(--fd)', fontSize: 19, fontWeight: 700,
          letterSpacing: '-.02em', color: 'var(--t1)', margin: 0,
        }}>
          {title}{pro && <ProBadge />}
        </h2>
      </div>
      <div style={{ marginBottom: 20, paddingLeft: 46 }}>
        <Path>{path}</Path>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingLeft: 46 }}>
        {steps.map((s, i) => <Step key={i} n={i + 1}>{s}</Step>)}
        {tip && <Tip>{tip}</Tip>}
      </div>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <div style={{ fontFamily: 'var(--fb)', background: 'var(--bg)', minHeight: '100vh', color: 'var(--t1)' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--nb)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--bo)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '1rem', color: 'var(--t1)' }}>
            <span style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoSvg />
            </span>
            JobFlow AI
          </Link>
          <Link
            href="/#pricing"
            style={{ fontSize: 13, fontWeight: 600, color: '#fff', padding: '7px 16px', background: 'var(--b)', borderRadius: 'var(--r1)', lineHeight: 1 }}
          >
            Get JobFlow
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 96px' }}>

        {/* Page header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--b)', marginBottom: 12 }}>
          <span style={{ width: 16, height: 2, background: 'var(--b)', borderRadius: 1, display: 'inline-block' }} />
          Usage guide
        </div>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: 12, color: 'var(--t1)' }}>
          How it works
        </h1>
        <p style={{ fontSize: 15, color: 'var(--t2)', maxWidth: 480, lineHeight: 1.7, marginBottom: 56 }}>
          Step-by-step instructions for every feature. New here? Start at <Path>/onboarding</Path>. To update your profile later, go to <Path>/profile</Path>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

          <Feature
            icon="🔍"
            title="JD Decode"
            path="/new"
            steps={[
              <>Open <Path>/new</Path>. You will see two input modes: <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Paste URL</strong> and <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Paste JD text</strong>.</>,
              <><strong style={{ color: 'var(--t1)', fontWeight: 600 }}>URL mode (faster):</strong> paste the job posting link and click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Analyze JD</strong>. JobFlow fetches the page and extracts the role, requirements, nice-to-haves, and a fit verdict against your profile.</>,
              <><strong style={{ color: 'var(--t1)', fontWeight: 600 }}>If the URL fails</strong> - some platforms (Workday, Greenhouse, Lever, LinkedIn Easy Apply) block automated access. If you see an error, switch to <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Paste JD text</strong>, copy the full job description text from the platform manually, paste it into the box, and click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Analyze JD</strong> again.</>,
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
              <>After decoding a JD, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Generate CV</strong>. JobFlow writes each section of your CV tailored to that specific role.</>,
              <>Once generated, review each section. If a section does not read well, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Regenerate</strong> on that section to get a new version without touching the others.</>,
              <>Add optional instructions in the section prompt field before regenerating - for example &quot;emphasise team leadership&quot; or &quot;mention the fintech context&quot;.</>,
              <>When satisfied, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Download .docx</strong> to get the final CV file, ready to submit.</>,
              <>The application is auto-saved to your tracker at <Path>/tracker</Path>.</>,
            ]}
            tip="Each section regenerates independently - you do not need to redo the whole CV to fix one paragraph."
          />

          <Feature
            icon="✉️"
            title="Cover letters"
            path="/new - Cover letter tab"
            steps={[
              <>After generating a CV, switch to the <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Cover letter</strong> tab on the same page. A draft is already written based on the same JD decode.</>,
              <>Read through the letter. It is structured as: opening hook, why this role, why you, closing call to action.</>,
              <>To rewrite a paragraph, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Regenerate</strong> next to it. Add instructions in the prompt field to adjust the tone or focus - for example &quot;more formal&quot; or &quot;highlight the startup experience&quot;.</>,
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
              <>Open an entry to update its status: <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Applied, Screening, Interview, Offer, Rejected</strong>. Keep this current so your history stays useful.</>,
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
            path="/tracker - open application - Q&A tab"
            pro
            steps={[
              <>Open an application from the tracker and go to the <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Q&A</strong> tab. Or start from <Path>/new</Path> and switch to the Q&A tab after generating.</>,
              <>Paste between 1 and 4 free-text questions from the application form. These are the open-ended questions employers ask alongside the CV submission.</>,
              <>Click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Generate answers</strong>. Claude writes responses in your voice, drawing from both your profile and the JD decode for that application.</>,
              <>Edit each answer directly in the text field. They are pre-filled but yours to adjust - treat them as a strong first draft.</>,
              <>Copy and paste each answer into the application form. They are not automatically submitted anywhere.</>,
            ]}
            tip="Paste the questions exactly as written in the form - spelling, punctuation, and all. Claude uses the phrasing to calibrate tone and length."
          />

        </div>

        {/* Footer nav */}
        <div style={{ marginTop: 72, paddingTop: 32, borderTop: '1px solid var(--bo)', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--t3)' }}>- Back to home</Link>
          <Link href="/#pricing" style={{ fontSize: 13, color: 'var(--b)', fontWeight: 600 }}>Get JobFlow -&gt;</Link>
        </div>

      </div>
    </div>
  )
}
