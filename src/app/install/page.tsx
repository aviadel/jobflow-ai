import Link from 'next/link'

export const metadata = {
  title: 'Install JobFlow',
  description: 'Set up your own JobFlow instance in about ten minutes.',
}

const BG      = '#0d1117'
const SURFACE = '#161b22'
const BORDER  = '#21262d'
const TEXT    = '#e6edf3'
const MUTED   = '#7d8590'
const ACCENT  = '#4493f8'
const GREEN   = '#3fb950'
const AMBER   = '#d29922'

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai' +
  '&env=ANTHROPIC_API_KEY,APP_PASSWORD,INTERNAL_SECRET,JOBFLOW_LICENSE_KEY' +
  '&envDescription=Your%20Claude%20API%20key%2C%20a%20password%20to%20protect%20your%20instance%2C%20a%20random%20string%2C%20and%20your%20license%20key' +
  '&envLink=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai%23environment-variables' +
  '&project-name=jobflow-ai&repository-name=jobflow-ai'

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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5,
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4,
      padding: '1px 6px', color: TEXT, wordBreak: 'break-all',
    }}>{children}</code>
  )
}

function Block({ children }: { children: string }) {
  return (
    <pre style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 6,
      padding: '12px 14px', fontSize: 12.5, color: TEXT, overflowX: 'auto',
      fontFamily: 'var(--font-geist-mono), monospace', margin: '12px 0 0',
    }}><code>{children}</code></pre>
  )
}

function Callout({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: React.ReactNode }) {
  const c = tone === 'warn' ? AMBER : ACCENT
  return (
    <div style={{
      background: tone === 'warn' ? 'rgba(210,153,34,.08)' : 'rgba(68,147,248,.08)',
      border: `1px solid ${tone === 'warn' ? 'rgba(210,153,34,.25)' : 'rgba(68,147,248,.2)'}`,
      borderRadius: 6, padding: '11px 14px', fontSize: 13, color: c,
      lineHeight: 1.65, marginTop: 14,
    }}>{children}</div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 36 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12,
          fontWeight: 600, color: ACCENT, flexShrink: 0,
        }}>{String(n).padStart(2, '0')}</span>
        <h2 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', color: TEXT, margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.75, paddingLeft: 26 }}>
        {children}
      </div>
    </section>
  )
}

export default function InstallPage() {
  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: BG, minHeight: '100vh', color: TEXT }}>

      <nav style={{ maxWidth: 780, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          {LOGO}
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, letterSpacing: '-.01em' }}>JobFlow</span>
        </Link>
        <Link href="/how-it-works" style={{ fontSize: 13, fontWeight: 500, color: MUTED, textDecoration: 'none' }}>
          How it works
        </Link>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 32px 96px' }}>

        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: GREEN, marginBottom: 12 }}>
          Thanks for your purchase
        </p>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 14 }}>
          Install JobFlow
        </h1>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, lineHeight: 1.7, marginBottom: 20 }}>
          About ten minutes, most of it waiting for Vercel to build. You will need
          your license key, which has been emailed to you.
        </p>

        <Callout>
          <strong>No license key email?</strong> Check your spam folder first. It is sent by
          Lemon Squeezy immediately after payment. If it has not arrived after a few minutes,
          reply to your receipt and we will resend it.
        </Callout>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 44 }}>

          <Section n={1} title="Get a Claude API key">
            JobFlow runs on your own Anthropic account, so the AI usage is billed to you
            directly rather than through us. Sign up at{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>console.anthropic.com</a>,
            open <strong style={{ color: TEXT }}>Settings → API keys</strong>, and create one.
            <Callout tone="warn">
              While you are there, set a spend limit under <strong>Settings → Limits</strong>.
              JobFlow costs a few cents per application, but a limit means nothing can ever
              surprise you with a bill.
            </Callout>
          </Section>

          <Section n={2} title="Deploy your own copy">
            This clones the repository into your GitHub account and deploys it to your Vercel
            account. It is yours - nobody else can reach it.
            <div style={{ marginTop: 16 }}>
              <a
                href={DEPLOY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: ACCENT, color: '#fff', padding: '10px 20px', borderRadius: 6,
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}
              >
                Deploy to Vercel &nbsp;↗
              </a>
            </div>
            <p style={{ marginTop: 16 }}>Vercel will ask for four values:</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['ANTHROPIC_API_KEY', 'The key from step 1'],
                ['JOBFLOW_LICENSE_KEY', 'The key from your purchase email'],
                ['APP_PASSWORD', 'Any password you choose. Your browser asks for it on first visit'],
                ['INTERNAL_SECRET', 'A random string - generate one below'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <Code>{k}</Code>
                  <span style={{ fontSize: 13.5 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16 }}>
              For <Code>INTERNAL_SECRET</Code>, run either of these and paste the output:
            </p>
            <Block>{`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}</Block>
            <Block>{`openssl rand -hex 32`}</Block>
          </Section>

          <Section n={3} title="Add a database">
            <strong style={{ color: TEXT }}>Do this before you start using the app.</strong> By
            default JobFlow writes to temporary storage that Vercel wipes whenever your server
            restarts - about fifteen minutes after you stop using it. Every CV, cover letter and
            tracker entry would disappear.
            <p style={{ marginTop: 14 }}>In your new Vercel project:</p>
            <ol style={{ margin: '10px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Go to <strong style={{ color: TEXT }}>Storage → Create Database → Postgres</strong>. The free tier is plenty.</li>
              <li>Vercel sets <Code>POSTGRES_URL</Code> for you automatically - nothing to copy.</li>
              <li>Add one more environment variable: <Code>DATA_PROVIDER</Code> set to <Code>postgres</Code>.</li>
              <li>Redeploy from the <strong style={{ color: TEXT }}>Deployments</strong> tab.</li>
            </ol>
            <p style={{ marginTop: 14 }}>
              Tables are created on first use. There is nothing to migrate or configure.
            </p>
          </Section>

          <Section n={4} title="Check your configuration">
            Open <Code>/setup</Code> on your new deployment - for example{' '}
            <Code>your-project.vercel.app/setup</Code>. Your browser will ask for the{' '}
            <Code>APP_PASSWORD</Code> you chose. Leave the username blank.
            <p style={{ marginTop: 14 }}>
              Every row must be green. If one is not, the card tells you exactly what to fix.
            </p>
            <Callout tone="warn">
              Environment variable changes only take effect on a <strong>new deployment</strong>.
              After editing one in Vercel, redeploy before rechecking this page.
            </Callout>
          </Section>

          <Section n={5} title="Build your profile">
            Go to <Code>/onboarding</Code>. Upload your current CV, paste your LinkedIn About
            section, and name the roles you are targeting. Takes about five minutes.
            <p style={{ marginTop: 14 }}>
              Everything JobFlow generates is built from this, so it is worth doing properly.
            </p>
          </Section>

          <Section n={6} title="Start applying">
            Open <Code>/new</Code>, paste a job posting, and click{' '}
            <strong style={{ color: TEXT }}>Analyze JD</strong>. From there JobFlow writes a
            tailored CV and cover letter, and files the application in your tracker.
            <p style={{ marginTop: 16 }}>
              <Link href="/how-it-works" style={{ color: ACCENT, fontWeight: 500 }}>
                Read the full usage guide →
              </Link>
            </p>
          </Section>

        </div>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: `1px solid ${BORDER}` }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 12 }}>
            If something goes wrong
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13.5, color: MUTED, lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: TEXT }}>Every page sends you to /setup.</strong>{' '}
              Your license key is missing or was not accepted. Open <Code>/setup</Code> - the
              License key row says which.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: TEXT }}>License key rejected.</strong>{' '}
              Check it was pasted in full with no trailing spaces, and that you redeployed
              afterwards.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: TEXT }}>Activation limit reached.</strong>{' '}
              Your key is registered to more instances than its limit allows. In Lemon Squeezy,
              open <strong style={{ color: TEXT }}>My Orders → Manage license</strong> and
              deactivate one you no longer use.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: TEXT }}>Analyze JD fails on a URL.</strong>{' '}
              Some platforms block automated access - Workday, Greenhouse, Lever and LinkedIn
              Easy Apply among them. Switch to <strong style={{ color: TEXT }}>Paste JD text</strong>{' '}
              and copy the description across manually.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 22, flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontSize: 13, color: MUTED, textDecoration: 'none' }}>← Back to home</Link>
          <Link href="/how-it-works" style={{ fontSize: 13, color: ACCENT, textDecoration: 'none', fontWeight: 500 }}>Usage guide →</Link>
        </div>

      </div>
    </div>
  )
}
