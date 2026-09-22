import Link from 'next/link'

export const metadata = {
  title: 'Terms & Conditions - JobFlow',
  description: 'JobFlow terms of use, license grant, and purchase policy.',
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
          <Link href="/#pricing" style={{ fontSize: 13, fontWeight: 600, color: '#fff', padding: '7px 16px', background: 'var(--b)', borderRadius: 'var(--r1)', lineHeight: 1 }}>
            Get JobFlow
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
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <Section title="1. What you are buying">
          <p>
            JobFlow is a self-hosted software toolkit you deploy to your own Vercel account. When you purchase a license you receive
            a license key that unlocks the software for one deployment. You are not purchasing a hosted service, a subscription, or
            any ongoing managed infrastructure.
          </p>
        </Section>

        <Section title="2. License grant">
          <p>
            Your license is personal and non-transferable. It covers one active Vercel deployment. You may re-deploy (for example,
            after a reset or migration) using the same key. You may not resell, sublicense, or redistribute the software or your
            license key.
          </p>
        </Section>

        <Section title="3. One-time payment">
          <p>
            The purchase price is a single, one-time charge. There are no recurring fees, no subscriptions, and no hidden costs.
            Your Anthropic API usage is billed directly by Anthropic under your own API key - that cost is separate and outside
            this agreement.
          </p>
        </Section>

        <Section title="4. Updates">
          <p>
            Starter licenses include software updates for 6 months from the date of purchase. Professional licenses include
            updates for 12 months. After that period the software continues to work - you simply will not receive new features
            or fixes automatically. You can purchase a new license at any time to renew update access.
          </p>
        </Section>

        <Section title="5. No refunds">
          <p>
            All purchases are final. Because JobFlow is a digital product that is immediately accessible upon payment, we do not
            offer refunds. If you have a technical issue preventing you from running the software, contact us at{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: 'var(--b)' }}>info@jobflow-ai.app</a> and we will do our best to
            help you resolve it.
          </p>
        </Section>

        <Section title="6. Your data">
          <p>
            JobFlow runs entirely within your own Vercel deployment. Your CV, job descriptions, cover letters, and application
            history are stored in your instance and are never sent to or stored by JobFlow. The only external services your
            instance communicates with are Anthropic (for AI generation) and any database adapter you configure (such as Google
            Sheets), both under your own accounts.
          </p>
        </Section>

        <Section title="7. No warranty">
          <p>
            JobFlow is provided &quot;as is&quot; without warranty of any kind. We do not guarantee that the software will be
            error-free, uninterrupted, or suitable for any particular purpose. AI-generated content (CVs, cover letters) should
            be reviewed by you before use - we are not responsible for the accuracy or outcomes of generated content.
          </p>
        </Section>

        <Section title="8. Limitation of liability">
          <p>
            To the maximum extent permitted by law, JobFlow and its author shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the software, including but not limited to lost job opportunities,
            data loss, or costs from third-party services.
          </p>
        </Section>

        <Section title="9. Acceptable use">
          <p>
            You may not use JobFlow to generate documents intended to misrepresent your qualifications or deceive employers. You
            may not use it to bulk-spam job applications in an automated, unsupervised manner. Normal job searching is
            explicitly permitted and encouraged.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>
            These terms are governed by the laws of Israel. Any disputes shall be resolved in the courts of Tel Aviv, Israel.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            Questions about these terms?{' '}
            <a href="mailto:info@jobflow-ai.app" style={{ color: 'var(--b)' }}>info@jobflow-ai.app</a>
          </p>
        </Section>

        <div style={{ paddingTop: 8, display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--t3)' }}>- Back to home</Link>
          <Link href="/#pricing" style={{ fontSize: 13, color: 'var(--b)', fontWeight: 600 }}>Get JobFlow -&gt;</Link>
        </div>

      </div>
    </div>
  )
}
