import Link from 'next/link'

export const metadata = {
  title: 'Install JobFlow',
  description: 'Set up your own JobFlow instance in about ten minutes.',
}

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai' +
  '&env=ANTHROPIC_API_KEY,APP_PASSWORD,INTERNAL_SECRET,JOBFLOW_LICENSE_KEY' +
  '&envDescription=Your%20Claude%20API%20key%2C%20a%20password%20to%20protect%20your%20instance%2C%20a%20random%20string%2C%20and%20your%20license%20key' +
  '&envLink=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai%23environment-variables' +
  '&project-name=jobflow-ai&repository-name=jobflow-ai'

const CSS = `
:root{
  --b:#2563EB;--bl:#3B82F6;--b50:#EFF6FF;--b100:#DBEAFE;
  --am:#D97706;--aml:#FEF3C7;
  --ok:#059669;--okl:#D1FAE5;
  --bg:#F8FAFC;--bg2:#F1F5F9;--ca:#FFFFFF;--bo:#CBD5E1;--bo2:#E2E8F0;
  --t1:#0F172A;--t2:#475569;--t3:#64748B;
  --nb:rgba(248,250,252,0.93);
  --r1:6px;--r2:10px;
  --fd:'Outfit',system-ui,sans-serif;--fb:'DM Sans',system-ui,sans-serif;
}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --am:#FBBF24;--aml:#422006;
  --ok:#34D399;--okl:#064E3B;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--nb:rgba(11,17,32,0.93);
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --am:#FBBF24;--aml:#422006;
  --ok:#34D399;--okl:#064E3B;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--nb:rgba(11,17,32,0.93);
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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'ui-monospace,monospace', fontSize: 12.5,
      background: 'var(--bg2)', border: '1px solid var(--bo)', borderRadius: 4,
      padding: '1px 6px', color: 'var(--t1)', wordBreak: 'break-all' as const,
    }}>{children}</code>
  )
}

function Block({ children }: { children: string }) {
  return (
    <pre style={{
      background: 'var(--bg2)', border: '1px solid var(--bo)', borderRadius: 'var(--r1)',
      padding: '12px 14px', fontSize: 12.5, color: 'var(--t1)', overflowX: 'auto' as const,
      fontFamily: 'ui-monospace,monospace', margin: '12px 0 0',
    }}><code>{children}</code></pre>
  )
}

function Callout({ tone = 'info', children }: { tone?: 'info' | 'warn'; children: React.ReactNode }) {
  const isWarn = tone === 'warn'
  return (
    <div style={{
      background: isWarn ? 'var(--aml)' : 'var(--b50)',
      border: `1px solid ${isWarn ? 'rgba(217,119,6,.3)' : 'var(--b100)'}`,
      borderRadius: 'var(--r1)', padding: '11px 14px', fontSize: 13,
      color: isWarn ? 'var(--am)' : 'var(--b)',
      lineHeight: 1.65, marginTop: 14,
    }}>{children}</div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: '1px solid var(--bo)', paddingTop: 36 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'ui-monospace,monospace', fontSize: 12,
          fontWeight: 700, color: 'var(--b)', flexShrink: 0,
        }}>{String(n).padStart(2, '0')}</span>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--t1)', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.75, paddingLeft: 26 }}>
        {children}
      </div>
    </section>
  )
}

export default function InstallPage() {
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
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '1rem', color: 'var(--t1)' }}>
            <span style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LogoSvg />
            </span>
            JobFlow AI
          </Link>
          <Link href="/how-it-works" style={{ fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>
            How it works
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 96px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--ok)', marginBottom: 12 }}>
          <span style={{ width: 16, height: 2, background: 'var(--ok)', borderRadius: 1, display: 'inline-block' }} />
          Thanks for your purchase
        </div>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: 14, color: 'var(--t1)' }}>
          Install JobFlow
        </h1>
        <p style={{ fontSize: 15, color: 'var(--t2)', maxWidth: 520, lineHeight: 1.7, marginBottom: 20 }}>
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
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)', fontWeight: 500 }}>console.anthropic.com</a>,
            open <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Settings &rarr; API keys</strong>, and create one.
            <Callout tone="warn">
              While you are there, set a spend limit under <strong>Settings &rarr; Limits</strong>.
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
                  background: 'var(--b)', color: '#fff', padding: '10px 20px', borderRadius: 'var(--r1)',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                Deploy to Vercel &nbsp;&rarr;
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
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' as const }}>
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
            <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Do this before you start using the app.</strong> By
            default JobFlow writes to temporary storage that Vercel wipes whenever your server
            restarts - about fifteen minutes after you stop using it. Every CV, cover letter and
            tracker entry would disappear.
            <p style={{ marginTop: 14 }}>In your new Vercel project:</p>
            <ol style={{ margin: '10px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Go to <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Storage &rarr; Create Database &rarr; Postgres</strong>. The free tier is plenty.</li>
              <li>Vercel sets <Code>POSTGRES_URL</Code> for you automatically - nothing to copy.</li>
              <li>Add one more environment variable: <Code>DATA_PROVIDER</Code> set to <Code>postgres</Code>.</li>
              <li>Redeploy from the <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Deployments</strong> tab.</li>
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
            <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Analyze JD</strong>. From there JobFlow writes a
            tailored CV and cover letter, and files the application in your tracker.
            <p style={{ marginTop: 16 }}>
              <Link href="/how-it-works" style={{ color: 'var(--b)', fontWeight: 600 }}>
                Read the full usage guide &rarr;
              </Link>
            </p>
          </Section>

        </div>

        <div style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid var(--bo)' }}>
          <h3 style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>
            If something goes wrong
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Every page sends you to /setup.</strong>{' '}
              Your license key is missing or was not accepted. Open <Code>/setup</Code> - the
              License key row says which.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>License key rejected.</strong>{' '}
              Check it was pasted in full with no trailing spaces, and that you redeployed
              afterwards.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Activation limit reached.</strong>{' '}
              Your key is registered to more instances than its limit allows. In Lemon Squeezy,
              open <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>My Orders &rarr; Manage license</strong> and
              deactivate one you no longer use.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Analyze JD fails on a URL.</strong>{' '}
              Some platforms block automated access - Workday, Greenhouse, Lever and LinkedIn
              Easy Apply among them. Switch to <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Paste JD text</strong>{' '}
              and copy the description across manually.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 44, paddingTop: 24, borderTop: '1px solid var(--bo)', display: 'flex', gap: 22, flexWrap: 'wrap' as const }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--t3)' }}>- Back to home</Link>
          <Link href="/how-it-works" style={{ fontSize: 13, color: 'var(--b)', fontWeight: 600 }}>Usage guide &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
