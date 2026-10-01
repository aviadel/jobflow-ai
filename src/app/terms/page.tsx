import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions - JobFlow',
  description: 'JobFlow terms of use and open source license.',
}

const CSS = `
:root{
  --b:#2563EB;--b50:#EFF6FF;--b100:#DBEAFE;
  --bg:#F8FAFC;--bg2:#F1F5F9;--ca:#FFFFFF;--bo:#CBD5E1;
  --t1:#0F172A;--t2:#475569;--t3:#64748B;
  --nb:rgba(248,250,252,0.93);
  --r1:6px;--r2:10px;
  --fd:'Outfit',system-ui,sans-serif;--fb:'DM Sans',system-ui,sans-serif;
}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#64748B;--nb:rgba(11,17,32,0.93);
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --bg:#0B1120;--bg2:#111827;--ca:#1E293B;--bo:#334155;
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid var(--bo)' }}>
      <h2 style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>{title}</h2>
      <div style={{ fontSize: 14.5, color: 'var(--t2)', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

export default function TermsPage() {
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
          <Link href="/install" style={{ fontSize: 13, fontWeight: 600, color: '#fff', padding: '7px 16px', background: 'var(--b)', borderRadius: 'var(--r1)', lineHeight: 1 }}>
            Deploy free
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 96px' }}>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--b)', marginBottom: 12 }}>
          <span style={{ width: 16, height: 2, background: 'var(--b)', borderRadius: 1, display: 'inline-block' }} />
          Legal
        </div>
        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8, color: 'var(--t1)' }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 48 }}>
          Last updated: 1 October 2026
        </p>

        <Section title="1. What this is">
          <p>
            JobFlow is free, open source software you deploy to your own Vercel account. There is no purchase, no license key,
            and no subscription. You clone or deploy the code, bring your own Anthropic API key, and run your own instance.
          </p>
        </Section>

        <Section title="2. License">
          <p>
            JobFlow&apos;s source code is licensed under the{' '}
            <a href="https://github.com/aviadel/jobflow-ai/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)' }}>
              Apache License 2.0
            </a>. In short: you may use, modify, and redistribute the software, including for commercial purposes, as long as you
            retain the copyright notice and license text. The license includes an express patent grant and disclaims warranty
            and liability (see sections 6 and 7 below, which restate what the license already says). The license text in the
            repository is the authoritative version - this page is a plain-language summary, not a substitute for it.
          </p>
        </Section>

        <Section title="3. Cost">
          <p>
            JobFlow itself is free. The only costs you incur are your own: Anthropic API usage (typically a few cents per
            generated document, billed directly to you by Anthropic) and, if your usage exceeds Vercel&apos;s free Hobby tier,
            whatever Vercel charges you directly. JobFlow and its author receive none of this.
          </p>
        </Section>

        <Section title="4. Contributions">
          <p>
            Pull requests and issues are welcome on{' '}
            <a href="https://github.com/aviadel/jobflow-ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)' }}>
              GitHub
            </a>. By submitting a contribution, you agree it is licensed under the same Apache License 2.0 as the rest of the
            project.
          </p>
        </Section>

        <Section title="5. Your data">
          <p>
            JobFlow runs entirely within your own Vercel deployment. Your CV, job descriptions, cover letters, and application
            history are stored in your instance and are never sent to or stored by us. The only external services your
            instance communicates with are Anthropic (for AI generation) and any database adapter you configure (such as Google
            Sheets), both under your own accounts.
          </p>
        </Section>

        <Section title="6. No warranty">
          <p>
            JobFlow is provided &quot;as is&quot;, without warranty of any kind, as set out in the Apache License 2.0. We do not
            guarantee that the software will be error-free, uninterrupted, or suitable for any particular purpose. AI-generated
            content (CVs, cover letters) should be reviewed by you before use - we are not responsible for the accuracy or
            outcomes of generated content.
          </p>
        </Section>

        <Section title="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, and as set out in the Apache License 2.0, JobFlow and its contributors shall
            not be liable for any damages arising from your use of the software, including but not limited to lost job
            opportunities, data loss, or costs from third-party services.
          </p>
        </Section>

        <Section title="8. Acceptable use">
          <p>
            You may not use JobFlow to generate documents intended to misrepresent your qualifications or deceive employers. You
            may not use it to bulk-spam job applications in an automated, unsupervised manner. Normal job searching is
            explicitly permitted and encouraged.
          </p>
        </Section>

        <Section title="9. Changes to these terms">
          <p>
            We may update these terms from time to time. When we do, we will update the &quot;Last updated&quot; date at the
            top of this page. Material changes will be announced on the GitHub repository where possible.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions?{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: 'var(--b)' }}>info@jobflow-ai.app</a>{' '}
            or open an issue on{' '}
            <a href="https://github.com/aviadel/jobflow-ai/issues" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--b)' }}>GitHub</a>.
          </p>
        </Section>

        <div style={{ paddingTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--t3)' }}>- Back to home</Link>
          <Link href="/install" style={{ fontSize: 13, color: 'var(--b)', fontWeight: 600 }}>Deploy free -&gt;</Link>
        </div>

      </div>
    </div>
  )
}
