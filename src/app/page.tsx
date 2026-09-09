import Link from 'next/link'

const BG       = '#0d1117'
const SURFACE  = '#161b22'
const BORDER   = '#21262d'
const BORDER2  = '#30363d'
const TEXT     = '#e6edf3'
const MUTED    = '#7d8590'
const ACCENT   = '#4493f8'
const GREEN    = '#3fb950'
const PURPLE   = '#a371f7'

const RESPONSIVE = `
  .jf-hero-grid::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none;
    background-color: #0d1117;
    background-image:
      linear-gradient(#21262d 1px, transparent 1px),
      linear-gradient(90deg, #21262d 1px, transparent 1px);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%);
    opacity: .35;
  }
  .jf-feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 64px;
  }
  .jf-feature-card {
    padding: 24px 22px;
    background: #0d1117;
    border-right: 1px solid #21262d;
    border-bottom: 1px solid #21262d;
    transition: background .15s;
  }
  .jf-feature-card:hover { background: #161b22; }
  .jf-feature-card:nth-child(3n) { border-right: none; }
  .jf-feature-card:nth-last-child(-n+3) { border-bottom: none; }
  .jf-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  @media (max-width: 700px) {
    .jf-feature-grid { grid-template-columns: 1fr; border-radius: 10px; }
    .jf-feature-card { border-right: none !important; }
    .jf-pricing-grid { grid-template-columns: 1fr; }
  }
`

const LOGO = (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const FEATURES = [
  { icon: '📄', title: 'CV generation',       desc: 'Tailored CV per application. Self-correcting AI pass. Section-by-section regen until you approve.' },
  { icon: '✉️', title: 'Cover letters',        desc: 'Written in parallel with your CV. Matches your voice. Custom-prompt regen per section.' },
  { icon: '🔍', title: 'JD Decode',            desc: 'Extract role, keywords, and a fit verdict against your profile in one click.' },
  { icon: '📊', title: 'Application tracker',  desc: 'Status, notes, and history - stored in your own instance, never shared.' },
  { icon: '🔬', title: 'Resume audit',          desc: 'ATS compatibility check, keyword gap analysis, and LinkedIn consistency review.', pro: true },
  { icon: '💬', title: 'Application Q&A',      desc: 'Paste 1-4 free-text questions from the application form. Claude answers in your voice.', pro: true },
]

export const metadata = {
  title: 'JobFlow - AI-powered job application toolkit',
  description: 'Generate tailored CVs and cover letters for every application. Self-hosted, one-time purchase, powered by Claude.',
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>
}) {
  const { expired } = await searchParams

  return (
    <div style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: BG, minHeight: '100vh', color: TEXT }}>
      <style>{RESPONSIVE}</style>

      {/* Trial-expired banner */}
      {expired && (
        <div style={{ background: '#7f1d1d', color: '#fff', padding: '10px 24px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>
          Your 7-day free trial has ended - purchase a license below to continue.
        </div>
      )}

      {/* Nav */}
      <nav style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {LOGO}
          <span style={{ fontSize: 17, fontWeight: 600, color: TEXT, letterSpacing: '-.01em' }}>JobFlow</span>
        </div>
        <Link
          href="/setup"
          style={{ fontSize: 13, fontWeight: 500, color: MUTED, textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER2}`, borderRadius: 6 }}
        >
          Open app →
        </Link>
      </nav>

      {/* Hero */}
      <div className="jf-hero-grid" style={{ position: 'relative' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '88px 32px 80px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '4px 12px 4px 8px', border: `1px solid ${BORDER2}`, borderRadius: 99,
            fontSize: 12, fontWeight: 500, color: MUTED, marginBottom: 28, background: SURFACE,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN, flexShrink: 0, boxShadow: `0 0 6px ${GREEN}`, display: 'inline-block' }} />
            AI-powered · Self-hosted · One-time purchase
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 62px)', fontWeight: 700, lineHeight: 1.08,
            letterSpacing: '-.03em', color: TEXT, maxWidth: 700, marginBottom: 22,
          }}>
            A tailored CV for{' '}
            <span style={{ color: ACCENT }}>every</span> application.
          </h1>

          <p style={{ fontSize: 17, color: MUTED, maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
            Paste a job description. JobFlow decodes it, writes a tailored CV, and drafts a cover letter - in under 2 minutes. Powered by Claude. Runs on your own Vercel instance.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai&env=ANTHROPIC_API_KEY,APP_PASSWORD&project-name=jobflow-ai&repository-name=jobflow-ai"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: ACCENT, color: '#fff', padding: '10px 20px', borderRadius: 6,
                fontSize: 14, fontWeight: 600, textDecoration: 'none', border: `1px solid #1f6feb`,
              }}
            >
              Deploy free &nbsp;↗
            </a>
            <Link
              href="/setup"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: SURFACE, color: TEXT, padding: '10px 20px', borderRadius: 6,
                fontSize: 14, fontWeight: 500, textDecoration: 'none', border: `1px solid ${BORDER2}`,
              }}
            >
              Open app →
            </Link>
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: MUTED }}>
            → 7-day free trial - no credit card required.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 32px', display: 'flex', overflowX: 'auto' }}>
          {[
            { num: '< 2 min',  label: 'per application' },
            { num: '7',        label: 'day free trial' },
            { num: '0',        label: 'subscriptions, ever' },
            { num: '∞',        label: 'applications per month' },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '18px 32px', flexShrink: 0,
              borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none',
              paddingLeft: i === 0 ? 0 : undefined,
            }}>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 22, fontWeight: 500, color: ACCENT, letterSpacing: '-.02em', lineHeight: 1 }}>{s.num}</span>
              <span style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.4, maxWidth: 90 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 32px 60px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 24 }}>
          What&apos;s included
        </p>
        <div className="jf-feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="jf-feature-card">
              {f.pro && (
                <span style={{
                  float: 'right', fontSize: 10, fontWeight: 700, letterSpacing: '.05em',
                  textTransform: 'uppercase', color: PURPLE,
                  background: 'rgba(163,113,247,.15)', borderRadius: 4, padding: '1px 6px',
                  border: '1px solid rgba(163,113,247,.25)',
                }}>
                  Pro
                </span>
              )}
              <span style={{ fontSize: 22, display: 'block', marginBottom: 14, lineHeight: 1 }}>{f.icon}</span>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <section style={{ borderTop: `1px solid ${BORDER}`, background: SURFACE }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 32px 80px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 10 }}>
            One-time purchase.
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: 520, lineHeight: 1.65, marginBottom: 48 }}>
            You bring your own Anthropic API key. No subscription, no lock-in, no data leaving your server. Less than one month of a competitor subscription - yours forever.
          </p>

          <div className="jf-pricing-grid">

            {/* Starter */}
            <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '28px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>Starter</div>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', color: TEXT, lineHeight: 1, marginBottom: 4 }}>€25</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 24 }}>one-time</div>
              {['CV generation', 'Cover letters', 'JD Decode', 'Application tracker', '6 months updates'].map((f) => (
                <div key={f} style={{ fontSize: 13, color: MUTED, padding: '4px 0', display: 'flex', gap: 9, alignItems: 'baseline' }}>
                  <span style={{ color: GREEN, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>

            {/* Professional */}
            <div style={{ background: BG, border: `2px solid ${ACCENT}`, borderRadius: 12, padding: '28px 24px', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: -11, left: 20,
                background: ACCENT, color: '#fff',
                fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
                textTransform: 'uppercase', padding: '3px 10px', borderRadius: 4,
              }}>
                ★ Best value
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>Professional</div>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', color: TEXT, lineHeight: 1, marginBottom: 4 }}>€49</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 24 }}>one-time</div>
              {['Everything in Starter', 'Resume audit', 'Application Q&A', 'Google Sheets adapter', '12 months updates'].map((f) => (
                <div key={f} style={{ fontSize: 13, color: MUTED, padding: '4px 0', display: 'flex', gap: 9, alignItems: 'baseline' }}>
                  <span style={{ color: GREEN, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>

            {/* Lifetime - coming soon */}
            <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '28px 24px', opacity: 0.45, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 14, right: 14,
                background: BORDER, color: MUTED,
                fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
                textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
              }}>
                Coming soon
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>Lifetime</div>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.03em', color: MUTED, lineHeight: 1, marginBottom: 4 }}>-</div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 24 }}>one-time</div>
              {['Everything in Professional', 'AI job suggestions', 'Supabase adapter', 'Updates forever'].map((f) => (
                <div key={f} style={{ fontSize: 13, color: MUTED, padding: '4px 0', display: 'flex', gap: 9, alignItems: 'baseline' }}>
                  <span style={{ color: BORDER2, flexShrink: 0 }}>-</span>{f}
                </div>
              ))}
            </div>

          </div>

          <p style={{ fontSize: 12, color: MUTED, marginTop: 20 }}>
            Rezi Pro charges $29/month. JobFlow costs less - once.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {LOGO}
          <span style={{ fontSize: 14, fontWeight: 600, color: MUTED }}>JobFlow</span>
        </div>
        <span style={{ fontSize: 12, color: MUTED }}>Self-hosted · Vercel + Claude API · One-time purchase</span>
      </footer>
    </div>
  )
}
