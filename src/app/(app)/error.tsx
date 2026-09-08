'use client'

import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
      <p style={{ fontSize: 32, marginBottom: 14 }}>⚠️</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#1A1917', marginBottom: 8 }}>
        Something went wrong
      </h2>
      <p style={{ fontSize: 14, color: '#6B6660', lineHeight: 1.6, marginBottom: 24 }}>
        {error.message || 'An unexpected error occurred.'}
        {error.digest && (
          <span style={{ display: 'block', fontSize: 11, color: '#A8A29E', marginTop: 8 }}>
            Ref: {error.digest}
          </span>
        )}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={reset}
          style={{ background: '#2362D4', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', background: '#F8F7F4', color: '#1A1917', border: '1px solid #D9D6CE', padding: '9px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
