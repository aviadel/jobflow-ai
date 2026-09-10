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
    text-decoration: none;
    display: block;
    cursor: pointer;
  }
  .jf-feature-card:hover { background: #161b22; }
  .jf-feature-card .jf-arrow { opacity: 0; transition: opacity .15s; color: #4493f8; font-size: 11px; }
  .jf-feature-card:hover .jf-arrow { opacity: 1; }
  .jf-feature-card:nth-child(3n) { border-right: none; }
  .jf-feature-card:nth-last-child(-n+3) { border-bottom: none; }
  .jf-pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .jf-howto-step {
    display: grid;
    grid-template-columns: 1fr 1.25fr;
    gap: 48px;
    align-items: center;
  }
  @media (max-width: 700px) {
    .jf-feature-grid { grid-template-columns: 1fr; border-radius: 10px; }
    .jf-feature-card { border-right: none !important; }
    .jf-pricing-grid { grid-template-columns: 1fr; }
    .jf-howto-step { grid-template-columns: 1fr; gap: 24px; }
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
  { icon: '📄', title: 'CV generation',       slug: 'cv-generation',      desc: 'Tailored CV per application. Self-correcting AI pass. Section-by-section regen until you approve.' },
  { icon: '✉️', title: 'Cover letters',        slug: 'cover-letters',      desc: 'Written in parallel with your CV. Matches your voice. Custom-prompt regen per section.' },
  { icon: '🔍', title: 'JD Decode',            slug: 'jd-decode',          desc: 'Extract role, keywords, and a fit verdict against your profile in one click.' },
  { icon: '📊', title: 'Application tracker',  slug: 'application-tracker', desc: 'Status, notes, and history - stored in your own instance, never shared.' },
  { icon: '🔬', title: 'Resume audit',          slug: 'resume-audit',       desc: 'ATS compatibility check, keyword gap analysis, and LinkedIn consistency review.', pro: true },
  { icon: '💬', title: 'Application Q&A',      slug: 'application-qa',     desc: 'Paste 1-4 free-text questions from the application form. Claude answers in your voice.', pro: true },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/how-it-works"
            style={{ fontSize: 13, fontWeight: 500, color: MUTED, textDecoration: 'none', padding: '6px 14px' }}
          >
            How it works
          </Link>
          <Link
            href="/setup"
            style={{ fontSize: 13, fontWeight: 500, color: MUTED, textDecoration: 'none', padding: '6px 14px', border: `1px solid ${BORDER2}`, borderRadius: 6 }}
          >
            Open app →
          </Link>
        </div>
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
            <Link key={f.title} href={`/features/${f.slug}`} className="jf-feature-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{f.icon}</span>
                <span className="jf-arrow">→</span>
              </div>
              {f.pro && (
                <span style={{
                  display: 'inline-block', marginBottom: 6,
                  fontSize: 10, fontWeight: 700, letterSpacing: '.05em',
                  textTransform: 'uppercase', color: PURPLE,
                  background: 'rgba(163,113,247,.15)', borderRadius: 4, padding: '1px 6px',
                  border: '1px solid rgba(163,113,247,.25)',
                }}>
                  Pro
                </span>
              )}
              <div style={{ fontSize: 13.5, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>{f.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* How to use */}
      <section style={{ borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '72px 32px 80px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>
            Setup
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-.025em', marginBottom: 10 }}>
            Up and running in 10 minutes.
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: 480, lineHeight: 1.65, marginBottom: 56 }}>
            Deploy once. Use forever. Your API key, your data, your server.
          </p>

          {/* Step 01 */}
          <div className="jf-howto-step" style={{ marginBottom: 64 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: ACCENT, display: 'block', marginBottom: 10 }}>01</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, color: TEXT }}>Deploy to Vercel</h3>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>
                Click &quot;Deploy free&quot; above and follow the Vercel clone flow. Add your three required keys, then go to Vercel <strong style={{ color: TEXT }}>Storage → Create Database → Postgres</strong> (free tier) — Vercel sets <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11.5, color: TEXT }}>POSTGRES_URL</span> automatically. Add <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11.5, color: TEXT }}>DATA_PROVIDER=postgres</span> and redeploy.
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['ANTHROPIC_API_KEY', 'APP_PASSWORD', 'LICENSE_SIGNING_SECRET', 'DATA_PROVIDER'].map((v) => (
                  <span key={v} style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 10.5, background: SURFACE, border: `1px solid ${BORDER2}`, borderRadius: 4, padding: '3px 7px', color: TEXT }}>{v}</span>
                ))}
              </div>
            </div>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: TEXT, fontSize: 11.5, fontWeight: 600 }}>▲ Vercel</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: MUTED }}>Environment Variables</span>
              </div>
              {[
                { k: 'ANTHROPIC_API_KEY',       v: 'sk-ant-api03-••••••••••••••••' },
                { k: 'APP_PASSWORD',             v: '••••••••••' },
                { k: 'LICENSE_SIGNING_SECRET',   v: '••••••••••••••••••••••' },
                { k: 'DATA_PROVIDER',            v: 'postgres' },
                { k: 'POSTGRES_URL',             v: 'postgres://••••@••••/verceldb' },
              ].map(({ k, v }) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', borderBottom: `1px solid ${BORDER}`, padding: '9px 14px', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', color: TEXT, fontSize: 11, fontWeight: 500 }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono), monospace', color: MUTED, fontSize: 10.5 }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: '12px 14px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, background: BG, border: `1px solid ${BORDER2}`, color: MUTED, padding: '6px 14px', borderRadius: 5 }}>Add more</span>
                <span style={{ fontSize: 12, background: ACCENT, color: '#fff', padding: '6px 14px', borderRadius: 5, fontWeight: 600 }}>Deploy ▲</span>
              </div>
            </div>
          </div>

          {/* Step 02 */}
          <div className="jf-howto-step" style={{ marginBottom: 64 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: ACCENT, display: 'block', marginBottom: 10 }}>02</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, color: TEXT }}>Verify your config</h3>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>
                Visit your Vercel URL and sign in with <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 12.5, color: TEXT }}>APP_PASSWORD</span> when prompted. You land on the config check - everything must be green before you continue. Your 7-day free trial starts on first visit.
              </p>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: MUTED, display: 'inline-block', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '3px 8px' }}>/setup</span>
            </div>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Configuration check</span>
              </div>
              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Claude API key',  detail: 'ANTHROPIC_API_KEY is set' },
                  { label: 'License key',     detail: 'Valid - starter tier' },
                  { label: 'Storage',         detail: 'Postgres connected' },
                  { label: 'App password',    detail: 'APP_PASSWORD is set' },
                ].map(({ label, detail }) => (
                  <div key={label} style={{ background: 'rgba(63,185,80,.08)', border: '1px solid rgba(63,185,80,.25)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#14532d', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: TEXT }}>{label}</div>
                      <div style={{ fontSize: 10.5, color: GREEN }}>{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 14px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 12, background: ACCENT, color: '#fff', padding: '6px 14px', borderRadius: 5, fontWeight: 600 }}>Continue to profile setup →</span>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="jf-howto-step" style={{ marginBottom: 64 }}>
            <div>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: ACCENT, display: 'block', marginBottom: 10 }}>03</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, color: TEXT }}>Set up your profile</h3>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>
                Upload your current CV, paste your LinkedIn About section, and fill in your target roles. Takes about 5 minutes. JobFlow uses your profile as the base for every tailored document it generates.
              </p>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: MUTED, display: 'inline-block', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '3px 8px' }}>/onboarding</span>
            </div>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>Set up your profile</span>
                <span style={{ color: MUTED, fontSize: 10.5, fontFamily: 'var(--font-geist-mono), monospace' }}>1 / 3</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Upload your current CV</div>
                <div style={{ border: `1px dashed ${BORDER2}`, borderRadius: 6, padding: '14px 12px', textAlign: 'center', color: MUTED, fontSize: 11, marginBottom: 14 }}>
                  📄 Drop .pdf or .docx here, or click to browse
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Target roles</div>
                <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '6px 10px', fontSize: 11, color: MUTED, marginBottom: 14, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: SURFACE, border: `1px solid ${BORDER2}`, borderRadius: 3, padding: '2px 7px', color: TEXT }}>Software Engineer</span>
                  <span style={{ background: SURFACE, border: `1px solid ${BORDER2}`, borderRadius: 3, padding: '2px 7px', color: TEXT }}>Product Manager</span>
                  <span style={{ color: ACCENT, fontWeight: 600 }}>+</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 12, background: ACCENT, color: '#fff', padding: '6px 14px', borderRadius: 5, fontWeight: 600 }}>Next →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 04 */}
          <div className="jf-howto-step">
            <div>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: ACCENT, display: 'block', marginBottom: 10 }}>04</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 10, color: TEXT }}>Paste a JD, get a tailored CV</h3>
              <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>
                Go to New application, paste the job description, and click Generate. JobFlow decodes the role, maps it to your profile, and writes a tailored CV and cover letter. Download both as .docx and apply.
              </p>
              <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 11, color: MUTED, display: 'inline-block', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '3px 8px' }}>/new → Generate → /tracker</span>
            </div>
            <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ color: TEXT, fontWeight: 600, fontSize: 12 }}>New application</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>Job description</div>
                <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '8px 10px', fontSize: 11, color: MUTED, lineHeight: 1.6, marginBottom: 14, minHeight: 72 }}>
                  We are looking for a Senior Software Engineer to join our platform team. You will design, build, and maintain scalable backend services...
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 12.5, background: ACCENT, color: '#fff', padding: '7px 18px', borderRadius: 5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>✦ Generate CV</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10.5, color: GREEN, fontWeight: 600, marginBottom: 3 }}>✓ CV ready</div>
                    <div style={{ fontSize: 10.5, color: MUTED, fontFamily: 'var(--font-geist-mono), monospace' }}>senior_cv.docx</div>
                  </div>
                  <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 4, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10.5, color: GREEN, fontWeight: 600, marginBottom: 3 }}>✓ Cover letter</div>
                    <div style={{ fontSize: 10.5, color: MUTED, fontFamily: 'var(--font-geist-mono), monospace' }}>cover_platform.docx</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

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
              {['Everything in Starter', 'Resume audit', 'Application Q&A', 'Postgres + Sheets storage', '12 months updates'].map((f) => (
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
              {['Everything in Professional', 'AI job suggestions', 'Custom integrations', 'Updates forever'].map((f) => (
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
      <footer style={{ maxWidth: 1080, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {LOGO}
          <span style={{ fontSize: 14, fontWeight: 600, color: MUTED }}>JobFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: MUTED }}>info@jobflow-ai.app</span>
          <Link href="/terms" style={{ fontSize: 12, color: MUTED, textDecoration: 'none' }}>Terms &amp; Conditions</Link>
          <span style={{ fontSize: 12, color: MUTED }}>Self-hosted · Vercel + Claude API · One-time purchase</span>
        </div>
      </footer>
    </div>
  )
}
