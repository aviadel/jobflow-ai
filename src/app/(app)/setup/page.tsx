import Link from 'next/link'
import { resolveLicense } from '@/lib/license-server'
import { createDataProvider } from '@/lib/db'

export const metadata = { title: 'Setup — JobFlow' }

interface Check {
  label: string
  ok: boolean
  detail: string
  fix?: string
}

async function runChecks(): Promise<Check[]> {
  const checks: Check[] = []

  // 1. Anthropic API key
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY)
  checks.push({
    label: 'Claude API key',
    ok: hasApiKey,
    detail: hasApiKey ? 'ANTHROPIC_API_KEY is set' : 'ANTHROPIC_API_KEY is missing',
    fix: hasApiKey
      ? undefined
      : 'Add ANTHROPIC_API_KEY to your Vercel project → Settings → Environment Variables. Get a key at console.anthropic.com.',
  })

  // 2. License key
  const license = await resolveLicense()
  checks.push({
    label: 'License key',
    ok: license.valid,
    detail: license.valid
      ? `Valid - ${license.tier} tier`
      : process.env.JOBFLOW_LICENSE_KEY
        ? 'License key could not be verified'
        : 'No license key set - running on the free trial',
    fix: license.valid
      ? undefined
      : 'Set JOBFLOW_LICENSE_KEY in Vercel environment variables to the key from your purchase email, then redeploy.',
  })

  // 3. Storage
  const providerName = process.env.DATA_PROVIDER ?? 'json'
  const knownProviders = ['json', 'postgres', 'sheets']
  if (!knownProviders.includes(providerName)) {
    checks.push({
      label: 'Storage',
      ok: false,
      detail: `Unknown DATA_PROVIDER "${providerName}"`,
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
      const warning = providerName === 'json'
        ? ' — data is not persisted across server restarts. Set DATA_PROVIDER=postgres for permanent storage.'
        : ''
      checks.push({
        label: 'Storage',
        ok: providerName !== 'json',
        detail: `${providerLabel[providerName] ?? providerName} connected${warning}`,
        fix: providerName === 'json'
          ? 'In your Vercel dashboard: Storage → Create Database → Postgres. Then set DATA_PROVIDER=postgres and POSTGRES_URL (auto-filled by Vercel) and redeploy.'
          : undefined,
      })
    } catch (err) {
      const fixes: Record<string, string> = {
        postgres: 'Set POSTGRES_URL in Vercel environment variables. Go to Vercel dashboard → Storage → Create Database → Postgres, then redeploy.',
        sheets: 'Check GOOGLE_SHEETS_SPREADSHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON in Vercel environment variables.',
        json: 'The /tmp directory is unavailable — try redeploying.',
      }
      checks.push({
        label: 'Storage',
        ok: false,
        detail: `${providerLabel[providerName] ?? providerName} error: ${err instanceof Error ? err.message : String(err)}`,
        fix: fixes[providerName],
      })
    }
  }

  // 4. App password
  const hasPassword = Boolean(process.env.APP_PASSWORD)
  checks.push({
    label: 'App password',
    ok: hasPassword,
    detail: hasPassword ? 'APP_PASSWORD is set - instance is protected' : 'APP_PASSWORD is not set - instance is unprotected',
    fix: hasPassword
      ? undefined
      : 'Set APP_PASSWORD in Vercel environment variables to protect your instance.',
  })

  return checks
}

export default async function SetupPage() {
  const checks = await runChecks()
  const allGreen = checks.every((c) => c.ok)

  return (
    <main className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 inline-flex items-center gap-1 mb-8 no-underline">
        ← Home
      </Link>

      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
        Step 1 of 3 · App Config
      </p>
      <h1
        className="mb-1"
        style={{ fontFamily: 'Georgia, serif', fontSize: 28, lineHeight: 1.2, color: '#1A1917' }}
      >
        Configuration check
      </h1>
      <p className="text-sm text-zinc-500 mb-8">
        Everything here must be green before JobFlow can generate CVs.
      </p>

      {/* Checks */}
      <div className="flex flex-col gap-3 mb-8">
        {checks.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border p-5"
            style={{
              background: c.ok ? '#F0FDF4' : '#FFF8F8',
              borderColor: c.ok ? '#BBF7D0' : '#FECACA',
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: c.ok ? '#14532D' : '#7F1D1D',
                  color: '#fff',
                }}
              >
                {c.ok ? '✓' : '✗'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: '#1A1917' }}>
                    {c.label}
                  </span>
                </div>
                <p className="text-sm" style={{ color: c.ok ? '#14532D' : '#7F1D1D' }}>
                  {c.detail}
                </p>
                {c.fix && (
                  <p className="text-xs mt-1.5 text-zinc-500 leading-relaxed">{c.fix}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {allGreen ? (
        <div className="flex items-center gap-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#2362D4' }}
          >
            Continue to profile setup →
          </Link>
          <span className="text-xs text-zinc-400">
            or{' '}
            <Link href="/dashboard" className="underline underline-offset-2 hover:text-zinc-600">
              go to dashboard
            </Link>{' '}
            if you already have a profile
          </span>
        </div>
      ) : (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          Fix the issues above, update your Vercel environment variables, then{' '}
          <strong>redeploy</strong> or wait for a new deployment to pick up the changes.
        </div>
      )}
    </main>
  )
}
