import Link from 'next/link'

export const metadata = { title: '404 — JobFlow' }

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#ECEBE7', fontFamily: 'system-ui, sans-serif', padding: 24,
    }}>
      <p style={{ fontFamily: 'Georgia, serif', fontSize: 64, color: '#D9D6CE', lineHeight: 1, marginBottom: 16 }}>404</p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#1A1917', marginBottom: 8 }}>Page not found</h1>
      <p style={{ fontSize: 14, color: '#6B6660', marginBottom: 28 }}>That URL does not exist in this JobFlow instance.</p>
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex', background: '#2362D4', color: '#fff',
          padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Back to dashboard →
      </Link>
    </div>
  )
}
