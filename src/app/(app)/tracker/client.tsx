'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Application, ApplicationStatus } from '@/lib/db/types'

const RESPONSIVE = `
  @media(max-width:520px){
    .jf-tracker-wrap { padding:20px 14px 60px; }
    .jf-app-row { padding:12px 14px; gap:10px; }
  }
`

const STATUS_META: Record<ApplicationStatus, { label: string; bg: string; color: string }> = {
  saved:      { label: 'Saved',      bg: '#F3F4F6', color: '#374151' },
  applied:    { label: 'Applied',    bg: '#DBEAFE', color: '#1E40AF' },
  screening:  { label: 'Screening',  bg: '#FEF9C3', color: '#713F12' },
  interview:  { label: 'Interview',  bg: '#F3E8FF', color: '#6B21A8' },
  offer:      { label: 'Offer',      bg: '#DCFCE7', color: '#14532D' },
  rejected:   { label: 'Rejected',   bg: '#FEE2E2', color: '#7F1D1D' },
  withdrawn:  { label: 'Withdrawn',  bg: '#F3F4F6', color: '#6B7280' },
}

const ALL_STATUSES = Object.keys(STATUS_META) as ApplicationStatus[]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

type Filter = ApplicationStatus | 'all'

export function TrackerClient({ initialApps }: { initialApps: Application[] }) {
  const [apps, setApps] = useState(initialApps)
  const [filter, setFilter] = useState<Filter>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const visible = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  async function updateStatus(id: string, status: ApplicationStatus) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  async function deleteApp(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      if (res.ok) setApps(prev => prev.filter(a => a.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = apps.filter(a => a.status === s).length
    return acc
  }, {})

  return (
    <div className="jf-tracker-wrap" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 80px', fontFamily: 'system-ui, sans-serif' }}>
      <style>{RESPONSIVE}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2362D4', marginBottom: 4 }}>
            Applications
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#1A1917', margin: 0 }}>
            Tracker
          </h1>
        </div>
        <Link
          href="/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#2362D4', color: '#fff', padding: '8px 16px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          + New application
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {([
          ['all', apps.length, '#1A1917', '#F3F4F6'],
          ...(['applied', 'screening', 'interview', 'offer', 'rejected'] as ApplicationStatus[]).map(s => [
            s, counts[s] ?? 0, STATUS_META[s].color, STATUS_META[s].bg,
          ] as const),
        ] as [string, number, string, string][]).map(([s, n, color, bg]) => (
          <button
            key={s}
            onClick={() => setFilter(s as Filter)}
            style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: filter === s ? `2px solid ${color}` : '2px solid transparent',
              background: filter === s ? bg : '#F3F4F6', color: filter === s ? color : '#6B7280',
              transition: 'all 0.1s',
            }}
          >
            {s === 'all' ? 'All' : STATUS_META[s as ApplicationStatus].label} ({n})
          </button>
        ))}
      </div>

      {/* Empty state */}
      {apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px', background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1A1917', marginBottom: 8 }}>No applications yet</p>
          <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 24 }}>Generate your first tailored CV and it will appear here.</p>
          <Link
            href="/new"
            style={{
              display: 'inline-flex', background: '#2362D4', color: '#fff',
              padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Start a new application →
          </Link>
        </div>
      )}

      {/* Application list */}
      {visible.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map((app) => {
            const isExpanded = expandedId === app.id
            return (
              <div
                key={app.id}
                style={{
                  background: '#F8F7F4', border: '1px solid #D9D6CE', borderRadius: 12,
                  overflow: 'hidden', transition: 'box-shadow 0.15s',
                }}
              >
                {/* Main row */}
                <div className="jf-app-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', flexWrap: 'wrap' }}>
                  {/* Company + role */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1917' }}>{app.company}</span>
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#2362D4' }}>↗</a>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B6660', marginTop: 2 }}>
                      {app.jobTitle}{app.location ? ` · ${app.location}` : ''}
                    </div>
                  </div>

                  {/* Status select */}
                  <select
                    value={app.status}
                    onChange={e => updateStatus(app.id, e.target.value as ApplicationStatus)}
                    disabled={updatingId === app.id}
                    style={{
                      padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${STATUS_META[app.status].color}`,
                      background: STATUS_META[app.status].bg, color: STATUS_META[app.status].color,
                      opacity: updatingId === app.id ? 0.5 : 1,
                    }}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_META[s].label}</option>
                    ))}
                  </select>

                  {/* Date */}
                  <span style={{ fontSize: 12, color: '#A8A29E', flexShrink: 0 }}>
                    {formatDate(app.createdAt)}
                  </span>

                  {/* Expand / delete */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {app.notes && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        style={{
                          background: 'none', border: '1px solid #D9D6CE', borderRadius: 6,
                          padding: '3px 9px', fontSize: 11, cursor: 'pointer', color: '#6B6660',
                        }}
                      >
                        {isExpanded ? 'Hide' : 'Notes'}
                      </button>
                    )}
                    <button
                      onClick={() => { if (confirm(`Delete ${app.company} — ${app.jobTitle}?`)) deleteApp(app.id) }}
                      disabled={deletingId === app.id}
                      style={{
                        background: 'none', border: '1px solid #FCA5A5', borderRadius: 6,
                        padding: '3px 9px', fontSize: 11, cursor: 'pointer', color: '#B91C1C',
                        opacity: deletingId === app.id ? 0.5 : 1,
                      }}
                    >
                      {deletingId === app.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>

                {/* Expanded notes */}
                {isExpanded && app.notes && (
                  <div style={{ padding: '0 18px 16px', borderTop: '1px solid #E8E5DF', paddingTop: 12 }}>
                    <pre style={{ fontSize: 12, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                      {app.notes}
                    </pre>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {visible.length === 0 && apps.length > 0 && (
        <p style={{ fontSize: 13, color: '#6B6660', textAlign: 'center', padding: 32 }}>
          No {filter} applications.{' '}
          <button onClick={() => setFilter('all')} style={{ color: '#2362D4', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
            Clear filter
          </button>
        </p>
      )}
    </div>
  )
}
