import Link from 'next/link'

export const metadata = {
  title: 'Install JobFlow',
  description: 'Set up your own JobFlow instance in about ten minutes. Step-by-step guide for non-technical buyers.',
}

const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai' +
  '&env=ANTHROPIC_API_KEY,APP_PASSWORD,INTERNAL_SECRET,JOBFLOW_LICENSE_KEY' +
  '&envDescription=Your%20Claude%20API%20key%2C%20a%20password%20you%20choose%2C%20a%20random%20security%20string%2C%20and%20your%20license%20key' +
  '&envLink=https%3A%2F%2Fjobflow-ai.app%2Finstall' +
  '&project-name=jobflow-ai&repository-name=jobflow-ai'

const CSS = `
:root{
  --b:#2563EB;--bl:#3B82F6;--b50:#EFF6FF;--b100:#DBEAFE;
  --am:#D97706;--aml:#FEF3C7;
  --ok:#059669;--okl:#D1FAE5;
  --er:#DC2626;--erl:#FEE2E2;
  --pu:#7C3AED;--pul:#EDE9FE;
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
  --er:#F87171;--erl:#450A0A;
  --pu:#A78BFA;--pul:#2E1065;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;--bo2:#1E293B;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--nb:rgba(11,17,32,0.93);
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --am:#FBBF24;--aml:#422006;
  --ok:#34D399;--okl:#064E3B;
  --er:#F87171;--erl:#450A0A;
  --pu:#A78BFA;--pul:#2E1065;
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
      fontFamily: 'ui-monospace,monospace', margin: '10px 0 0', lineHeight: 1.5,
    }}><code>{children}</code></pre>
  )
}

function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'ok'; title?: string; children: React.ReactNode }) {
  const colors = {
    info: { bg: 'var(--b50)', border: 'var(--b100)', color: 'var(--b)' },
    warn: { bg: 'var(--aml)', border: 'rgba(217,119,6,.3)', color: 'var(--am)' },
    ok:   { bg: 'var(--okl)', border: 'rgba(5,150,105,.3)', color: 'var(--ok)' },
  }[tone]
  return (
    <div style={{
      background: colors.bg, border: `1px solid ${colors.border}`,
      borderRadius: 'var(--r1)', padding: '11px 14px', fontSize: 13,
      color: colors.color, lineHeight: 1.65, marginTop: 14,
    }}>
      {title && <strong style={{ display: 'block', marginBottom: 4 }}>{title}</strong>}
      {children}
    </div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ borderTop: '1px solid var(--bo)', paddingTop: 36 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 16 }}>
        <span style={{
          fontFamily: 'ui-monospace,monospace', fontSize: 12,
          fontWeight: 700, color: 'var(--b)', flexShrink: 0,
        }}>{String(n).padStart(2, '0')}</span>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--t1)', margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.8, paddingLeft: 26, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  )
}

function ScreenLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 8, marginTop: 20 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
      {children}
    </div>
  )
}

function EnvField({ name, placeholder, desc, tag }: { name: string; placeholder: string; desc: string; tag?: string }) {
  return (
    <div style={{ paddingTop: 14, paddingBottom: 14, borderBottom: '1px solid var(--bo2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{name}</span>
        {tag && (
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--b)', background: 'var(--b50)', border: '1px solid var(--b100)', borderRadius: 4, padding: '1px 6px' }}>{tag}</span>
        )}
      </div>
      <div style={{
        border: '1px solid var(--bo)', borderRadius: 'var(--r1)', padding: '9px 12px',
        background: 'var(--ca)', fontFamily: 'ui-monospace,monospace', fontSize: 12,
        color: 'var(--t3)', fontStyle: 'italic', marginBottom: 6,
      }}>{placeholder}</div>
      <p style={{ fontSize: 13, color: 'var(--t2)', margin: 0 }}>{desc}</p>
    </div>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" style={{ fontSize: 13, fontWeight: 500, color: 'var(--t2)', padding: '7px 12px', border: '1px solid var(--bo)', borderRadius: 'var(--r1)', lineHeight: 1 }}>
              &larr; Back
            </Link>
            <Link href="/how-it-works" style={{ fontSize: 13, fontWeight: 500, color: 'var(--t2)' }}>
              How it works
            </Link>
          </div>
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
        <p style={{ fontSize: 15, color: 'var(--t2)', maxWidth: 560, lineHeight: 1.7, marginBottom: 6 }}>
          About ten minutes, most of it waiting for Vercel to build. Follow each step in order - do not skip step 3.
        </p>
        <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 20 }}>
          You will need: your license key (emailed to you after purchase), and a credit card or free account on Anthropic.
        </p>

        <Callout title="No license key email?">
          Check your spam folder first - it is sent by Lemon Squeezy right after payment.
          The subject line contains &quot;JobFlow&quot;. If it has not arrived after five minutes,
          email us at info@jobflow-ai.app and we will resend it.
        </Callout>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginTop: 44 }}>

          {/* STEP 1 */}
          <Section n={1} title="Get a Claude API key">
            <p>
              JobFlow uses Claude AI to generate your CVs. You need your own Anthropic account so the
              usage is billed directly to you - you pay only for what you use (typically a few cents per CV).
            </p>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)', fontWeight: 500 }}>console.anthropic.com</a> and create a free account.</li>
              <li>In the left sidebar, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>API keys</strong>.</li>
              <li>Click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Create Key</strong>, give it any name (e.g. &quot;JobFlow&quot;), and click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Create</strong>.</li>
              <li>Copy the key - you will only see it once. Paste it somewhere temporarily (a notes app is fine).</li>
            </ol>

            <ScreenLabel>Your API key will look like this:</ScreenLabel>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bo)', borderRadius: 'var(--r1)', padding: '10px 14px', fontFamily: 'ui-monospace,monospace', fontSize: 13, color: 'var(--t1)', wordBreak: 'break-all' as const }}>
              sk-ant-api03-<span style={{ color: 'var(--t3)' }}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>It always starts with <Code>sk-ant-</Code> and is about 100 characters long.</p>

            <Callout tone="warn" title="Set a spend limit to avoid surprises.">
              While you are in the Anthropic console, go to <strong>Settings &rarr; Limits</strong> and set a
              monthly spend limit - $5 is more than enough for heavy usage. This prevents any unexpected
              charges if something goes wrong.
            </Callout>
          </Section>

          {/* STEP 2 */}
          <Section n={2} title="Deploy your own copy">
            <p>
              Click the button below. Vercel will copy the JobFlow code into your own GitHub account and
              deploy it as your private app. It will ask for four settings before it starts.
            </p>
            <div style={{ marginTop: 4, marginBottom: 4 }}>
              <a
                href={DEPLOY_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--b)', color: '#fff', padding: '11px 22px', borderRadius: 'var(--r1)',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                <svg width="16" height="14" viewBox="0 0 76 65" fill="#fff"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
                Deploy to Vercel
              </a>
            </div>

            <ScreenLabel>Vercel will ask you to fill in these four fields:</ScreenLabel>
            <div style={{ background: 'var(--ca)', border: '1.5px solid var(--bo)', borderRadius: 'var(--r2)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bo)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Environment Variables</span>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>- fill in all four before clicking Deploy</span>
              </div>
              <div style={{ padding: '0 16px' }}>
                <EnvField
                  name="ANTHROPIC_API_KEY"
                  placeholder="sk-ant-api03-..."
                  desc="The API key you copied in Step 1. Starts with sk-ant-."
                  tag="from step 1"
                />
                <EnvField
                  name="APP_PASSWORD"
                  placeholder="e.g. MyJobSearch2026"
                  desc="A password you invent right now. Your browser will ask for it every time you open your app. Write it down - you will need it again."
                  tag="you choose this"
                />
                <EnvField
                  name="INTERNAL_SECRET"
                  placeholder="e.g. 3a8f5c2b9d4e1f7a6b3c8..."
                  desc="A random security string. Generate it using one of the commands below and paste the result here."
                  tag="generate below"
                />
                <EnvField
                  name="JOBFLOW_LICENSE_KEY"
                  placeholder="e.g. a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                  desc="Your license key from the Lemon Squeezy purchase email. It looks like groups of letters and numbers separated by dashes."
                  tag="from email"
                />
              </div>
            </div>

            <div style={{ marginTop: 4 }}>
              <p style={{ fontWeight: 600, color: 'var(--t1)', marginBottom: 6 }}>Generating INTERNAL_SECRET:</p>
              <p>Copy one of these commands, run it in your terminal, and paste the output into the field above. If you do not have a terminal, ask a friend - or use any online random hex generator.</p>
              <Block>{`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}</Block>
              <Block>{`openssl rand -hex 32`}</Block>
              <p style={{ fontSize: 12.5, color: 'var(--t3)', marginTop: 6 }}>
                The result will be a 64-character string of letters and numbers. Any random string works - it does not have to be generated this way.
              </p>
            </div>

            <Callout tone="warn" title="If Vercel asks you to create a team:">
              You do not need a paid team. Click <strong>Skip</strong> or select <strong>Continue with Hobby</strong>.
              The free Hobby plan covers everything JobFlow needs.
            </Callout>
          </Section>

          {/* STEP 3 */}
          <Section n={3} title="Add a database to save your work">
            <p>
              <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Do this before you start using the app.</strong>{' '}
              Without a database, Vercel stores your CVs and tracker data in temporary memory that gets
              wiped every ~15 minutes when the server goes idle. Everything disappears. This step makes
              your data permanent.
            </p>

            <p>Inside your new Vercel project, follow these steps:</p>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>In the top navigation of your Vercel project, click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Storage</strong>.</li>
              <li>Click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Create Database</strong>. You will see a list of database types.</li>
              <li>
                Choose <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Neon</strong> (it may also be labeled as &quot;Postgres&quot; with the Neon logo).
                Do not choose KV, Blob, or any other option - only Neon/Postgres.
              </li>
              <li>Keep all the default settings and click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Create</strong>. The free tier is more than enough.</li>
              <li>Vercel automatically connects the database to your project - you do not need to copy any connection strings.</li>
            </ol>

            <ScreenLabel>After the database is created, add one more setting:</ScreenLabel>
            <div style={{ background: 'var(--ca)', border: '1.5px solid var(--bo)', borderRadius: 'var(--r2)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bo)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)' }}>Add this environment variable manually</span>
              </div>
              <div style={{ padding: '0 16px' }}>
                <EnvField
                  name="DATA_PROVIDER"
                  placeholder="postgres"
                  desc='Go to your Vercel project → Settings → Environment Variables → Add New. Name: DATA_PROVIDER, Value: postgres (exactly, lowercase). Then click Save.'
                  tag="type exactly: postgres"
                />
              </div>
            </div>

            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }} start={6}>
              <li>After saving the variable, go to the <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Deployments</strong> tab in your Vercel project.</li>
              <li>Click the three dots <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>&#8230;</strong> next to the most recent deployment and choose <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Redeploy</strong>.</li>
              <li>Wait about 30 seconds for it to finish.</li>
            </ol>

            <Callout tone="ok" title="Why redeploy?">
              Environment variable changes in Vercel only take effect when a new deployment runs.
              Always redeploy after adding or changing any variable.
            </Callout>
          </Section>

          {/* STEP 4 */}
          <Section n={4} title="Check your configuration">
            <p>
              After deploying, Vercel shows you your app&apos;s URL at the top of the project page.
              It will look something like <Code>jobflow-ai-abc123.vercel.app</Code>.
              Copy that URL and add <Code>/setup</Code> at the end.
            </p>
            <p>
              For example: <Code>jobflow-ai-abc123.vercel.app/setup</Code>
            </p>

            <ScreenLabel>Your browser will show a login popup like this:</ScreenLabel>
            <div style={{
              background: 'var(--ca)', border: '1.5px solid var(--bo)', borderRadius: 'var(--r2)',
              padding: 20, maxWidth: 380, boxShadow: '0 4px 16px rgba(0,0,0,.08)',
            }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--t1)', marginBottom: 4 }}>Sign in</p>
              <p style={{ fontSize: 12.5, color: 'var(--t3)', marginBottom: 16 }}>
                jobflow-ai-abc123.vercel.app is asking you to sign in
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Username</label>
                  <div style={{ border: '1.5px solid var(--bo)', borderRadius: 'var(--r1)', padding: '8px 10px', background: 'var(--bg2)', fontSize: 12.5, color: 'var(--t3)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>&#8678;</span> Leave this completely empty
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)', display: 'block', marginBottom: 4 }}>Password</label>
                  <div style={{ border: '1.5px solid var(--b)', borderRadius: 'var(--r1)', padding: '8px 10px', background: 'var(--b50)', fontSize: 12.5, color: 'var(--b)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>&#8678;</span> Type your APP_PASSWORD here
                  </div>
                </div>
              </div>
            </div>

            <Callout title="Username is always empty.">
              The username field does not matter - leave it blank. Only the password (your APP_PASSWORD) is checked.
            </Callout>

            <p style={{ marginTop: 4 }}>
              Once logged in, the <Code>/setup</Code> page runs five checks. Every row should show a green checkmark.
              If any row is red, it will tell you exactly what to fix.
            </p>

            <Callout tone="warn" title="Red row? Remember to redeploy.">
              Environment variable changes do not take effect until you redeploy. After fixing
              anything in Vercel Settings, always go to the Deployments tab and redeploy before
              checking <Code>/setup</Code> again.
            </Callout>
          </Section>

          {/* STEP 5 */}
          <Section n={5} title="Build your profile">
            <p>
              Go to <Code>/onboarding</Code> on your app (e.g. <Code>jobflow-ai-abc123.vercel.app/onboarding</Code>).
            </p>
            <p>
              You will be asked to fill in your work history, skills, and the types of roles you are targeting.
              The more detail you provide here, the better every CV JobFlow generates will be.
              This takes about five to ten minutes.
            </p>
            <p>Have these ready:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Your current CV (to copy your work history from)</li>
              <li>Your LinkedIn &quot;About&quot; section (copy and paste it in)</li>
              <li>A list of the job titles you are targeting</li>
            </ul>
            <Callout tone="ok" title="You can update your profile at any time.">
              Go to <Code>/profile</Code> to edit anything after onboarding. Your generated CVs always
              use the latest version of your profile.
            </Callout>
          </Section>

          {/* STEP 6 */}
          <Section n={6} title="Generate your first CV">
            <p>
              Go to <Code>/new</Code> on your app. Paste a job posting URL or copy-paste the job
              description text, then click <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Analyze JD</strong>.
            </p>
            <p>
              JobFlow will decode the job requirements and generate a tailored CV and cover letter in
              under two minutes. You can regenerate any section individually until you are happy with it,
              then download the final <Code>.docx</Code> file ready to submit.
            </p>
            <p>
              <Link href="/how-it-works" style={{ color: 'var(--b)', fontWeight: 600 }}>
                Read the full usage guide &rarr;
              </Link>
            </p>
          </Section>

        </div>

        {/* TROUBLESHOOTING */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--bo)' }}>
          <h3 style={{ fontFamily: 'var(--fd)', fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>
            If something goes wrong
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>500 error / &quot;Routing Middleware failed&quot;</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                Make sure you are going to <Code>/setup</Code> (lowercase) - not <Code>/SETUP</Code>.
                If the error persists, your <Code>INTERNAL_SECRET</Code> may be missing or set incorrectly.
                Check it in Vercel Settings and redeploy.
              </p>
            </div>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Every page sends me to /setup</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                Your license key is missing, invalid, or could not be verified. Open <Code>/setup</Code> and
                look at the License key row - it will say which. Make sure the key was pasted with no
                extra spaces, and that you redeployed after adding it.
              </p>
            </div>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Setup page is green but my data keeps disappearing</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                You skipped or did not complete Step 3. Go back and add a Neon (Postgres) database,
                set <Code>DATA_PROVIDER</Code> to <Code>postgres</Code>, and redeploy. Data will
                persist permanently after this.
              </p>
            </div>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>License key rejected</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                Check it was pasted in full with no trailing spaces. The key from your purchase email
                is a long string of letters, numbers, and dashes. If it still fails, email us with
                your order number and we will check it.
              </p>
            </div>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Activation limit reached</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                Your key is registered to more instances than its limit allows. Log into Lemon Squeezy,
                go to <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>My Orders &rarr; Manage license</strong>,
                and deactivate an instance you no longer use. Then redeploy your app.
              </p>
            </div>

            <div style={{ background: 'var(--ca)', border: '1px solid var(--bo)', borderRadius: 'var(--r2)', padding: '16px 18px' }}>
              <p style={{ fontWeight: 700, color: 'var(--t1)', marginBottom: 6 }}>Analyze JD fails on a URL</p>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75 }}>
                Some job platforms block automated access - Workday, Greenhouse, Lever, and LinkedIn
                Easy Apply among them. Switch to <strong style={{ color: 'var(--t1)', fontWeight: 600 }}>Paste JD text</strong>{' '}
                mode and copy the job description text across manually.
              </p>
            </div>

          </div>

          <div style={{ marginTop: 24, padding: '16px 18px', background: 'var(--b50)', border: '1px solid var(--b100)', borderRadius: 'var(--r2)', fontSize: 14, color: 'var(--b)' }}>
            <strong>Still stuck?</strong> Email us at{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: 'var(--b)', fontWeight: 600, textDecoration: 'underline' }}>info@jobflow-ai.app</a>{' '}
            with your Vercel project URL and a description of what you see. We respond within 24 hours.
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
