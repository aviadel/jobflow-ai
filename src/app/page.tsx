import Link from 'next/link'

export const metadata = {
  title: 'JobFlow — AI-powered job application toolkit',
  description: 'Generate tailored CVs and cover letters for every application. Self-hosted, one-time purchase, powered by Claude.',
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>
}) {
  const { expired } = await searchParams
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#ECEBE7', minHeight: '100vh' }}>

      {/* Trial-expired banner */}
      {expired && (
        <div style={{ background: '#B91C1C', color: '#fff', padding: '10px 24px', textAlign: 'center', fontSize: 14 }}>
          Your 7-day free trial has ended. Purchase a license below to continue.
        </div>
      )}

      {/* Nav */}
      <nav style={{ maxWidth: 900, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1917' }}>JobFlow</span>
        <Link
          href="/setup"
          style={{ fontSize: 13, fontWeight: 600, color: '#2362D4', textDecoration: 'none' }}
        >
          Open app →
        </Link>
      </nav>

      {/* Hero */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px 80px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 16 }}>
          AI Job Application Toolkit
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.1, color: '#1A1917', maxWidth: 640, marginBottom: 20 }}>
          A tailored CV for every application.
        </h1>
        <p style={{ fontSize: 17, color: '#6B6660', maxWidth: 520, lineHeight: 1.6, marginBottom: 12 }}>
          Paste a job description. JobFlow decodes it, writes a tailored CV, and generates a cover letter — all in under 2 minutes. Self-hosted on Vercel. Powered by Claude.
        </p>
        <p style={{ fontSize: 14, color: '#2362D4', fontWeight: 600, marginBottom: 32 }}>
          7-day free trial — no credit card required.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faviadel%2Fjobflow-ai&env=ANTHROPIC_API_KEY,APP_PASSWORD&project-name=jobflow-ai&repository-name=jobflow-ai"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#1A1917', color: '#fff', padding: '12px 24px',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Deploy to Vercel (free trial)
          </a>
          <Link
            href="/setup"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#2362D4', color: '#fff', padding: '12px 24px',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Open app →
          </Link>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 72 }}>
          {[
            { icon: '📄', title: 'CV generation', desc: 'Tailored 4–8 job CV per application. Self-correcting AI pass. Section-by-section regen.' },
            { icon: '✉️', title: 'Cover letters', desc: 'Parallel to CV generation. Custom-prompt regeneration. Matches your voice.' },
            { icon: '🔍', title: 'JD Decode', desc: 'Extract role, keywords, skills, and a fit verdict against your profile in one click.' },
            { icon: '📊', title: 'Application tracker', desc: 'Status, salary, notes, and history. Stored in your own Vercel instance.' },
          ].map((f) => (
            <div key={f.title} style={{ background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12, padding: 20 }}>
              <span style={{ fontSize: 22, display: 'block', marginBottom: 10 }}>{f.icon}</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1917', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#6B6660', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ marginTop: 80 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1A1917', marginBottom: 8 }}>One-time purchase</h2>
          <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 32 }}>You bring your own Anthropic API key. No subscription, no lock-in.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { tier: 'Starter', price: '$49', features: ['CV generation', 'Cover letters', 'JD Decode', 'Application tracker', '6 months updates'] },
              { tier: 'Professional', price: '$99', recommended: true, features: ['Everything in Starter', 'Resume Audit', 'Chrome Extension', 'DB adapters (Sheets, Supabase)', '12 months updates'] },
              { tier: 'Lifetime', price: '$179', features: ['Everything in Professional', 'AI Job Suggestions', 'Updates forever'] },
            ].map((p) => (
              <div
                key={p.tier}
                style={{
                  background: '#F8F7F4',
                  border: `${p.recommended ? '2' : '1'}px solid ${p.recommended ? '#2362D4' : '#D9D6CE'}`,
                  borderRadius: 12, padding: 20,
                }}
              >
                {p.recommended && (
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 4 }}>★ Best value</p>
                )}
                <div style={{ fontSize: 13, fontWeight: 700, color: '#6B6660', marginBottom: 4 }}>{p.tier}</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#1A1917', marginBottom: 12 }}>
                  {p.price} <span style={{ fontSize: 13, fontFamily: 'system-ui, sans-serif', color: '#A8A29E', fontWeight: 400 }}>one-time</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 12.5, color: '#6B6660', padding: '3px 0', display: 'flex', gap: 7 }}>
                      <span style={{ color: '#14532D' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ maxWidth: 900, margin: '0 auto', padding: '24px', borderTop: '1px solid #D9D6CE', fontSize: 12, color: '#A8A29E', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span>JobFlow</span>
        <span>Self-hosted · Vercel + Claude API · One-time purchase</span>
      </footer>
    </div>
  )
}
