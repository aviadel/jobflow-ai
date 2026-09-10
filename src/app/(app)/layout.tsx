import { cookies } from 'next/headers'
import Link from 'next/link'
import { parseTrialCookie, TRIAL_COOKIE } from '@/lib/license'
import { resolveLicense } from '@/lib/license-server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isLicensed = (await resolveLicense()).valid

  let trialDaysLeft: number | null = null
  if (!isLicensed) {
    const trialCookieVal = cookieStore.get(TRIAL_COOKIE)?.value
    const trial = parseTrialCookie(
      trialCookieVal,
      process.env.TRIAL_SECRET ?? '',
    )
    trialDaysLeft = trial?.daysLeft ?? null
  }

  return (
    <div className="min-h-screen bg-[#ECEBE7] dark:bg-[#0F0F0E]">
      {!isLicensed && trialDaysLeft !== null && (
        <div
          style={{
            background: '#2362D4',
            color: '#fff',
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 13,
            gap: 12,
          }}
        >
          <span>
            Free trial — <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining</strong>
          </span>
          <Link
            href="/"
            style={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}
          >
            Get a license →
          </Link>
        </div>
      )}
      {children}
    </div>
  )
}
