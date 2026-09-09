import Link from 'next/link'

const RESPONSIVE = `
  .jf-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 72px;
  }
  .jf-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  @media (max-width: 700px) {
    .jf-feature-grid { grid-template-columns: repeat(2, 1fr); margin-top: 48px; }
    .jf-pricing-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 420px) {
    .jf-feature-grid { grid-template-columns: 1fr; }
  }
`

export const metadata = {
  title: 'JobFlow — AI-powered job application toolkit',
  description: 'Generate tailored CVs and cover letters for every application. Self-hosted, one-time purchase, powered by Claude.',
}

const FEATURES = [
  {
    icon: '📄',
    title: 'CV generation',
    desc: 'Tailored CV per application. Self-correcting AI pass. Section-by-section regen until you approve.',
  },
  {
    icon: '✉️',
    title: 'Cover letters',
    desc: 'Written in parallel with your CV. Matches your voice. Custom-prompt regen per section.',
  },
  {
    icon: '🔍',
    title: 'JD Decode',
    desc: 'Extract role, keywords, and a fit verdict against your profile in one click.',
  },
  {
    icon: '📊',
    title: 'Application tracker',
    desc: 'Status, notes, and history — stored in your own instance, never shared.',
  },
  {
    icon: '🔬',
    title: 'Resume audit',
    desc: 'ATS compatibility check, keyword gap analysis, and LinkedIn consistency review.',
    pro: true,
  },
  {
    icon: '💬',
    title: 'Application Q&A',
    desc: 'Paste 1–4 free-text questions from the application form. Claude answers in your voice.',
    pro: true,
  },
]

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>
}) {
  const { expired } = await searchParams

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#ECEBE7', minHeight: '100vh', color: '#1A1917' }}>
      <style>{RESPONSIVE}</style>

      {/* Trial-expired banner */}
      {expired && (
        <div style={{ background: '#7F1D1D', color: '#fff', padding: '10px 24px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>
          Your 7-day free trial has ended — purchase a license below to continue.
        </div>
      )}

      {/* Nav */}
      <nav style={{ maxWidth: 960, margin: '0 auto', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1917', letterSpacing: '-.01em' }}>JobFlow</span>
        <Link
          href="/setup"
          style={{ fontSize: 13, fontWeight: 600, color: '#2362D4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          Open app →
        </Link>
      </nav>

      {/* Hero */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '64px 28px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 18 }}>
          AI Job Application Toolkit
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(34px, 6vw, 58px)',
          lineHeight: 1.08,
          color: '#1A1917',
          maxWidth: 620,
          marginBottom: 22,
          letterSpacing: '-.02em',
        }}>
          A tailored CV for every application.
        </h1>
        <p style={{ fontSize: 17, color: '#6B6660', maxWidth: 500, lineHeight: 1.65, marginBottom: 10 }}>
          Paste a job description. JobFlow decodes it, writes a tailored CV, and drafts a cover letter — in under 2 minutes. Self-hosted on Vercel. Powered by Claude.
        </p>
        <p style={{ fontSize: 14, color: '#2362D4', fontWeight: 600, marginBottom: 34 }}>
          7-day free trial — no credit card required.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai&env=ANTHROPIC_API_KEY,APP_PASSWORD&project-name=jobflow-ai&repository-name=jobflow-ai"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#1A1917', color: '#ECEBE7', padding: '12px 22px',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
              letterSpacing: '-.01em',
            }}
          >
            Deploy free (7-day trial)
          </a>
          <Link
            href="/setup"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: '#1A1917',
              border: '1.5px solid #D9D6CE',
              padding: '11px 22px',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Open app →
          </Link>
        </div>

        {/* Feature grid — 3×2, 2×3 on tablet, 1×6 on mobile */}
        <div className="jf-feature-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: '#F8F7F4',
                border: '1px solid #D9D6CE',
                borderRadius: 10,
                padding: '20px 20px 18px',
                position: 'relative',
              }}
            >
              {f.pro && (
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
                  textTransform: 'uppercase', color: '#6B21A8',
                  background: '#F3E8FF', borderRadius: 4, padding: '2px 6px',
                }}>
                  Pro
                </span>
              )}
              <span style={{ fontSize: 22, display: 'block', marginBottom: 10 }}>{f.icon}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1917', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: '#6B6660', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Pricing — dark section */}
      <section style={{ background: '#1A1917', color: '#ECEBE7' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 28px 80px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px, 4vw, 36px)', marginBottom: 8, letterSpacing: '-.02em' }}>
            One-time purchase.
          </h2>
          <p style={{ fontSize: 14, color: '#A8A29E', marginBottom: 40, lineHeight: 1.6 }}>
            You bring your own Anthropic API key. No subscription, no lock-in, no data leaving your server.
            <br />Less than one month of a competitor subscription — yours forever.
          </p>

          <div className="jf-pricing-grid">

            {/* Starter */}
            <div style={{
              background: '#242220',
              border: '1px solid #3A3733',
              borderRadius: 12,
              padding: '28px 24px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#A8A29E', marginBottom: 12 }}>Starter</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: '#ECEBE7', lineHeight: 1, marginBottom: 4 }}>
                €25
              </div>
              <div style={{ fontSize: 12, color: '#6B6660', marginBottom: 24 }}>one-time</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['CV generation', 'Cover letters', 'JD Decode', 'Application tracker', '6 months updates'].map((f) => (
                  <li key={f} style={{ fontSize: 12.5, color: '#A8A29E', padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#4ADE80', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div style={{
              background: '#242220',
              border: '2px solid #2362D4',
              borderRadius: 12,
              padding: '28px 24px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -11, left: 24,
                background: '#2362D4', color: '#fff',
                fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
                textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4,
              }}>
                ★ Best value
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#A8A29E', marginBottom: 12 }}>Professional</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: '#ECEBE7', lineHeight: 1, marginBottom: 4 }}>
                €49
              </div>
              <div style={{ fontSize: 12, color: '#6B6660', marginBottom: 24 }}>one-time</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Everything in Starter', 'Resume audit', 'Application Q&A', 'Google Sheets adapter', '12 months updates'].map((f) => (
                  <li key={f} style={{ fontSize: 12.5, color: '#A8A29E', padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#4ADE80', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifetime — Coming Soon */}
            <div style={{
              background: '#1E1D1B',
              border: '1px solid #2A2825',
              borderRadius: 12,
              padding: '28px 24px',
              opacity: 0.6,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: '#3A3733', color: '#A8A29E',
                fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
                textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
              }}>
                Coming soon
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6B6660', marginBottom: 12 }}>Lifetime</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: '#6B6660', lineHeight: 1, marginBottom: 4 }}>
                —
              </div>
              <div style={{ fontSize: 12, color: '#3A3733', marginBottom: 24 }}>one-time</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Everything in Professional', 'AI job suggestions', 'Supabase adapter', 'Updates forever'].map((f) => (
                  <li key={f} style={{ fontSize: 12.5, color: '#4A4845', padding: '4px 0', display: 'flex', gap: 8 }}>
                    <span style={{ color: '#4A4845', flexShrink: 0 }}>–</span> {f}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <p style={{ fontSize: 12, color: '#6B6660', marginTop: 24 }}>
            Rezi Pro charges $29/month. JobFlow costs less — once.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 960, margin: '0 auto', padding: '24px 28px', fontSize: 12, color: '#A8A29E', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderTop: '1px solid #D9D6CE' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#6B6660' }}>JobFlow</span>
        <span>Self-hosted · Vercel + Claude API · One-time purchase</span>
      </footer>

    </div>
  )
}
