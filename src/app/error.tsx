'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui, sans-serif', background: '#ECEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 32 }}>
          <p style={{ fontSize: 36, marginBottom: 16 }}>⚠️</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1917', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 24, lineHeight: 1.6 }}>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={reset}
            style={{ background: '#2362D4', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 16 }}>Error ref: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  )
}
