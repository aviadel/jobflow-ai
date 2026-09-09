import { ImageResponse } from 'next/og'

export const alt = 'JobFlow - AI-powered job application toolkit'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0d1117',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Subtle top border */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#3fb950' }} />

        {/* Logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 52 }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="7" fill="#161b22"/>
            <circle cx="8.5" cy="16" r="3" fill="#3fb950"/>
            <circle cx="23.5" cy="9" r="3" fill="#3fb950"/>
            <circle cx="23.5" cy="23" r="3" fill="#3fb950"/>
            <line x1="11.5" y1="14.5" x2="20" y2="10.5" stroke="#3fb950" strokeWidth="1.6" strokeLinecap="round"/>
            <polygon points="21,9.7 22.5,9 21.3,10.7" fill="#3fb950"/>
            <line x1="11.5" y1="17.5" x2="20" y2="21.5" stroke="#3fb950" strokeWidth="1.6" strokeLinecap="round"/>
            <polygon points="21,22.3 22.5,23 21.3,21.3" fill="#3fb950"/>
          </svg>
          <span style={{ fontSize: 30, fontWeight: 600, color: '#e6edf3', letterSpacing: '-0.02em' }}>JobFlow</span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 68, fontWeight: 700, color: '#e6edf3',
          lineHeight: 1.06, maxWidth: 820, marginBottom: 32,
          letterSpacing: '-0.03em',
        }}>
          A tailored CV for every application.
        </div>

        {/* Subline */}
        <div style={{ fontSize: 24, color: '#7d8590', maxWidth: 640, lineHeight: 1.5 }}>
          Paste a job description. Get a tailored CV and cover letter in under 2 minutes.
          Self-hosted · One-time purchase · Powered by Claude.
        </div>

        {/* Bottom accent */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#21262d' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
