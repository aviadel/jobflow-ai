import Link from 'next/link'
import { createDataProvider } from '@/lib/db'
import type { ApplicationStatus } from '@/lib/db/types'

const RESPONSIVE = `
  .jf-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
  .jf-actions { display:flex; gap:10px; margin-bottom:32px; flex-wrap:wrap; }
  @media(max-width:600px){
    .jf-stats { grid-template-columns:repeat(2,1fr); }
  }
`

export const metadata = { title: 'Dashboard — JobFlow' }

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; color: string }> = {
  saved:     { bg: '#F3F4F6', color: '#374151' },
  applied:   { bg: '#DBEAFE', color: '#1E40AF' },
  screening: { bg: '#FEF9C3', color: '#713F12' },
  interview: { bg: '#F3E8FF', color: '#6B21A8' },
  offer:     { bg: '#DCFCE7', color: '#14532D' },
  rejected:  { bg: '#FEE2E2', color: '#7F1D1D' },
  withdrawn: { bg: '#F3F4F6', color: '#6B7280' },
}

export default async function DashboardPage() {
  const db = createDataProvider()
  const [apps, profile] = await Promise.all([db.listApplications(), db.getProfile()])

  const total = apps.length
  const active = apps.filter(a => !['rejected', 'withdrawn'].includes(a.status)).length
  const interviews = apps.filter(a => a.status === 'interview').length
  const offers = apps.filter(a => a.status === 'offer').length

  const recent = [...apps]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const hasProfile = profile && profile.targetRoles?.length > 0

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{RESPONSIVE}</style>

      {/* Header */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 6 }}>
        JobFlow
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: '#1A1917', marginBottom: 4 }}>
        {profile?.name ? `Welcome back${profile.name ? `, ${profile.name.split(' ')[0]}` : ''}` : 'Dashboard'}
      </h1>
      {profile?.targetRoles?.length ? (
        <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 28 }}>
          Targeting: {profile.targetRoles.slice(0, 3).join(', ')}
        </p>
      ) : (
        <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 28 }}>
          Set up your profile to get started.
        </p>
      )}

      {/* Profile incomplete nudge */}
      {!hasProfile && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#C2410C', marginBottom: 2 }}>Profile not set up</p>
            <p style={{ fontSize: 12, color: '#92400E' }}>Claude needs your profile to tailor CVs and cover letters.</p>
          </div>
          <Link
            href="/onboarding"
            style={{
              flexShrink: 0, display: 'inline-flex', background: '#EA580C', color: '#fff',
              padding: '7px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Set up profile →
          </Link>
        </div>
      )}

      {/* Stats */}
      {total > 0 && (
        <div className="jf-stats">
          {[
            { label: 'Total', value: total, color: '#1A1917' },
            { label: 'Active', value: active, color: '#2362D4' },
            { label: 'Interviews', value: interviews, color: '#6B21A8' },
            { label: 'Offers', value: offers, color: '#14532D' },
          ].map(s => (
            <div key={s.label} style={{ background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6B6660', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="jf-actions">
        <Link
          href="/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#2362D4', color: '#fff', padding: '10px 20px',
            borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          + New application
        </Link>
        <Link
          href="/tracker"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#F8F7F4', color: '#1A1917', padding: '10px 20px',
            border: '1px solid #D9D6CE', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          View tracker ({total})
        </Link>
        <Link
          href="/onboarding"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#F8F7F4', color: '#6B6660', padding: '10px 20px',
            border: '1px solid #D9D6CE', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Edit profile
        </Link>
      </div>

      {/* Recent applications */}
      {recent.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1A1917' }}>Recent applications</h2>
            <Link href="/tracker" style={{ fontSize: 12, color: '#2362D4', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {recent.map(app => {
              const sc = STATUS_COLORS[app.status]
              return (
                <div
                  key={app.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 9,
                    padding: '11px 16px', flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1917' }}>{app.company}</span>
                    <span style={{ fontSize: 12, color: '#A8A29E', marginLeft: 8 }}>{app.jobTitle}</span>
                  </div>
                  <span style={{
                    display: 'inline-flex', padding: '2px 9px', borderRadius: 99,
                    fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color,
                  }}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  <span style={{ fontSize: 12, color: '#A8A29E', flexShrink: 0 }}>
                    {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {total === 0 && (
        <div style={{ textAlign: 'center', padding: '56px 24px', background: '#F8F7F4', border: '1px dashed #D9D6CE', borderRadius: 12 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#1A1917', marginBottom: 8 }}>No applications yet</p>
          <p style={{ fontSize: 13, color: '#6B6660', marginBottom: 20 }}>Paste a job description and JobFlow will write a tailored CV and cover letter in under 2 minutes.</p>
          <Link
            href="/new"
            style={{
              display: 'inline-flex', background: '#2362D4', color: '#fff',
              padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Generate your first application →
          </Link>
        </div>
      )}
    </div>
  )
}
