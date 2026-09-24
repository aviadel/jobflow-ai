import Link from 'next/link'
import { isSignedLicense } from '@/lib/license'
import { resolveLicense } from '@/lib/license-server'
import { createDataProvider } from '@/lib/db'
import SecretGenerator from './_components/SecretGenerator'

export const metadata = { title: 'Setup — JobFlow' }

export const dynamic = 'force-dynamic'

interface Check {
  label: string
  ok: boolean
  detail: string
  envVar?: string
  example?: string
  source?: string
  fix?: string
  generate?: true
}

async function runChecks(): Promise<Check[]> {
  const checks: Check[] = []

  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY)
  checks.push({
    label: 'Claude API key',
    ok: hasApiKey,
    detail: hasApiKey ? 'ANTHROPIC_API_KEY is set' : 'ANTHROPIC_API_KEY is missing',
    envVar: 'ANTHROPIC_API_KEY',
    example: 'sk-ant-api03-...',
    source: 'console.anthropic.com → API Keys → Create Key',
    fix: 'Create a free account at console.anthropic.com, go to API Keys, and create a new key.',
  })

  const license = await resolveLicense()
  checks.push({
    label: 'License key',
    ok: license.valid,
    detail: license.valid
      ? `Valid — ${license.tier} tier`
      : license.hasKey
        ? license.error ?? 'License key is set but could not be verified'
        : 'No license key set — JobFlow requires a license to run',
    envVar: 'JOBFLOW_LICENSE_KEY',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    source: 'Your purchase email from Lemon Squeezy (subject: "JobFlow")',
    fix: license.hasKey
      ? 'Check the key was pasted in full with no extra spaces. Env var changes only apply after a redeploy.'
      : 'Buy a license at jobflow-ai.app. The key is emailed to you immediately after purchase.',
  })

  const hasInternalSecret = Boolean(process.env.INTERNAL_SECRET)
  const needsInternalSecret = !isSignedLicense(process.env.JOBFLOW_LICENSE_KEY ?? '')
  checks.push({
    label: 'Internal secret',
    ok: hasInternalSecret || !needsInternalSecret,
    detail: hasInternalSecret
      ? 'INTERNAL_SECRET is set'
      : needsInternalSecret
        ? 'INTERNAL_SECRET is missing'
        : 'Not required for this license type',
    envVar: needsInternalSecret ? 'INTERNAL_SECRET' : undefined,
    example: needsInternalSecret ? '64-character random hex string' : undefined,
    source: needsInternalSecret ? 'Generate one using the button below' : undefined,
    fix: needsInternalSecret
      ? 'Generate a random value using the button below, then add it to Vercel.'
      : undefined,
    generate: needsInternalSecret && !hasInternalSecret ? true : undefined,
  })

  const providerName = process.env.DATA_PROVIDER ?? 'json'
  const knownProviders = ['json', 'postgres', 'sheets']
  if (!knownProviders.includes(providerName)) {
    checks.push({
      label: 'Storage',
      ok: false,
      detail: `Unknown DATA_PROVIDER "${providerName}"`,
      envVar: 'DATA_PROVIDER',
      example: 'postgres',
      fix: `Set DATA_PROVIDER to one of: ${knownProviders.join(', ')}.`,
    })
  } else {
    const providerLabel: Record<string, string> = {
      json: 'Temporary (json)',
      postgres: 'Postgres',
      sheets: 'Google Sheets',
    }
    try {
      const db = createDataProvider()
      await db.getProfile()
      checks.push({
        label: 'Storage',
        ok: providerName !== 'json',
        detail: providerName === 'json'
          ? 'Using temporary storage — data will be lost when the server restarts'
          : `${providerLabel[providerName]} connected`,
        envVar: providerName === 'json' ? 'DATA_PROVIDER' : undefined,
        example: providerName === 'json' ? 'postgres' : undefined,
        source: providerName === 'json'
          ? 'Vercel dashboard → Storage → Create Database → Neon (Postgres)'
          : undefined,
        fix: providerName === 'json'
          ? 'Create a free Neon database in your Vercel project, then set DATA_PROVIDER=postgres and redeploy.'
          : undefined,
      })
    } catch (err) {
      console.error('[setup] storage check failed:', err)
      checks.push({
        label: 'Storage',
        ok: false,
        detail: `${providerLabel[providerName] ?? providerName} could not be reached`,
        envVar: providerName === 'postgres' ? 'POSTGRES_URL' : undefined,
        source: providerName === 'postgres'
          ? 'Vercel dashboard → Storage → Create Database → Neon (auto-fills POSTGRES_URL)'
          : undefined,
        fix: providerName === 'postgres'
          ? 'Create a Neon database in Vercel → Storage. Vercel fills in the connection URL automatically.'
          : 'Check your storage configuration in Vercel environment variables.',
      })
    }
  }

  const hasPassword = Boolean(process.env.APP_PASSWORD)
  checks.push({
    label: 'App password',
    ok: hasPassword,
    detail: hasPassword ? 'APP_PASSWORD is set — instance is protected' : 'APP_PASSWORD is not set — anyone can access your app',
    envVar: 'APP_PASSWORD',
    example: 'any password you choose',
    fix: 'Choose any password and add it as APP_PASSWORD in Vercel. Your browser will ask for it every time you open the app. Leave the username field blank — only the password is checked.',
  })

  return checks
}

const CSS = `
:root {
  --b:#2563EB;--b50:#EFF6FF;--b100:#DBEAFE;
  --ok:#059669;--okl:#D1FAE5;
  --er:#991B1B;--erl:#FEF2F2;--erb:#FECACA;
  --am:#D97706;--aml:#FFFBEB;--amb:#FDE68A;
  --bg:#F8FAFC;--ca:#FFFFFF;--bo:#E2E8F0;
  --t1:#0F172A;--t2:#475569;--t3:#94A3B8;
  --sbo:#CBD5E1;--sbg:#F8FAFC;
}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --ok:#34D399;--okl:#064E3B;
  --er:#FCA5A5;--erl:#1C0505;--erb:#7F1D1D;
  --am:#FCD34D;--aml:#1C1208;--amb:#92400E;
  --bg:#0B1120;--ca:#1E293B;--bo:#334155;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#475569;
  --sbo:#334155;--sbg:#111827;
}}
:root[data-theme="dark"]{
  --b:#60A5FA;--b50:#172554;--b100:#1E3A5F;
  --ok:#34D399;--okl:#064E3B;
  --er:#FCA5A5;--erl:#1C0505;--erb:#7F1D1D;
  --am:#FCD34D;--aml:#1C1208;--amb:#92400E;
  --bg:#0B1120;--ca:#1E293B;--bo:#334155;
  --t1:#F1F5F9;--t2:#94A3B8;--t3:#475569;
  --sbo:#334155;--sbg:#111827;
}
*,*::before,*::after{box-sizing:border-box}
`

function CheckIcon({ ok }: { ok: boolean }) {
  return (
    <span style={{
      flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 800,
      background: ok ? 'var(--ok)' : 'var(--er)',
      color: '#fff',
    }}>
      {ok ? '✓' : '✗'}
    </span>
  )
}

function EnvVarBox({ name, example }: { name: string; example?: string }) {
  return (
    <div style={{
      border: '1.5px solid var(--sbo)', borderRadius: 8,
      overflow: 'hidden', marginTop: 14,
    }}>
      <div style={{
        padding: '8px 12px', background: 'var(--sbg)',
        borderBottom: '1px solid var(--sbo)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>
          Environment variable name
        </span>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
          {name}
        </code>
      </div>
      {example && (
        <>
          <div style={{ height: 1, background: 'var(--bo)' }} />
          <div style={{ padding: '8px 12px', background: 'var(--sbg)', borderTop: '1px solid var(--sbo)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--t3)' }}>
              Example value
            </span>
          </div>
          <div style={{ padding: '10px 12px' }}>
            <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: 12, color: 'var(--t2)', fontStyle: 'italic' }}>
              {example}
            </code>
          </div>
        </>
      )}
    </div>
  )
}

export default async function SetupPage() {
  const checks = await runChecks()
  const allGreen = checks.every((c) => c.ok)
  const failedCount = checks.filter(c => !c.ok).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--t1)' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 20px 80px' }}>

        {/* Back link */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--t3)', marginBottom: 32, textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Home
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--b)' }}>
              Setup · Step 1 of 3
            </span>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>·</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: allGreen ? 'var(--ok)' : 'var(--er)' }}>
              {allGreen ? 'All checks passed' : `${failedCount} issue${failedCount !== 1 ? 's' : ''} to fix`}
            </span>
          </div>
          <h1 style={{ fontFamily: 'system-ui,sans-serif', fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 8px', color: 'var(--t1)' }}>
            Configuration check
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t2)', margin: 0, lineHeight: 1.6 }}>
            Everything here must be green before JobFlow can generate CVs.
            {!allGreen && ' Fix each red item, then redeploy your Vercel project.'}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--bo)', borderRadius: 2, marginBottom: 28, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width .4s',
            background: allGreen ? 'var(--ok)' : 'var(--b)',
            width: `${Math.round((checks.filter(c => c.ok).length / checks.length) * 100)}%`,
          }} />
        </div>

        {/* Check cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {checks.map((c, i) => (
            <div
              key={c.label}
              style={{
                border: `1.5px solid ${c.ok ? 'var(--bo)' : 'var(--erb)'}`,
                borderRadius: 12,
                background: c.ok ? 'var(--ca)' : 'var(--erl)',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div style={{
                padding: '14px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                borderBottom: c.ok ? 'none' : `1px solid var(--erb)`,
              }}>
                <div style={{ paddingTop: 1 }}>
                  <CheckIcon ok={c.ok} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{c.label}</span>
                    <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', color: 'var(--t3)', background: 'var(--sbg)', border: '1px solid var(--sbo)', borderRadius: 4, padding: '1px 5px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: c.ok ? 'var(--ok)' : 'var(--er)', fontWeight: 500 }}>
                    {c.detail}
                  </p>
                </div>
              </div>

              {/* Expanded content for failed checks */}
              {!c.ok && (
                <div style={{ padding: '16px 16px 18px 16px' }}>

                  {c.fix && (
                    <p style={{ fontSize: 13.5, color: 'var(--t2)', margin: '0 0 4px', lineHeight: 1.7 }}>
                      {c.fix}
                    </p>
                  )}

                  {c.source && (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', flexShrink: 0 }}>Where:</span>
                      <span style={{ fontSize: 13, color: 'var(--t2)' }}>{c.source}</span>
                    </div>
                  )}

                  {c.envVar && (
                    <EnvVarBox name={c.envVar} example={c.generate ? undefined : c.example} />
                  )}

                  {c.generate && (
                    <div style={{ marginTop: 14 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 4px' }}>
                        Generate your INTERNAL_SECRET here
                      </p>
                      <SecretGenerator />
                    </div>
                  )}

                  <div style={{
                    marginTop: 14, padding: '10px 12px', borderRadius: 6,
                    background: 'rgba(0,0,0,.04)', fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.6,
                  }}>
                    <strong style={{ color: 'var(--t1)' }}>Add it in Vercel:</strong>{' '}
                    Go to your Vercel project &rarr; <strong>Settings</strong> &rarr; <strong>Environment Variables</strong> &rarr; <strong>Add New</strong>.
                    Then go to the <strong>Deployments</strong> tab and click <strong>Redeploy</strong>.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA / next steps */}
        <div style={{ marginTop: 28 }}>
          {allGreen ? (
            <div style={{
              border: '1.5px solid rgba(5,150,105,.3)', borderRadius: 12,
              background: 'var(--okl)', padding: '20px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>&#10003;</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ok)' }}>Everything looks good!</span>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link
                  href="/onboarding"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 8, background: 'var(--b)',
                    color: '#fff', fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Continue to profile setup &rarr;
                </Link>
                <Link
                  href="/dashboard"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 8, border: '1.5px solid var(--bo)',
                    background: 'var(--ca)', color: 'var(--t2)',
                    fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              border: '1.5px solid var(--amb)', borderRadius: 12,
              background: 'var(--aml)', padding: '16px 18px',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: 'var(--am)' }}>
                What to do next
              </p>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: 'var(--t2)', lineHeight: 1.8 }}>
                <li>Fix each red item above (expand it to see exactly what to add)</li>
                <li>
                  In Vercel: <strong style={{ color: 'var(--t1)' }}>Settings &rarr; Environment Variables &rarr; Add New</strong>
                </li>
                <li>
                  Go to <strong style={{ color: 'var(--t1)' }}>Deployments</strong> &rarr; click <strong style={{ color: 'var(--t1)' }}>Redeploy</strong> on the latest deployment
                </li>
                <li>Come back to this page &mdash; it will recheck automatically</li>
              </ol>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
