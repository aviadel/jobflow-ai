export default function DashboardLoading() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={pulse} />
      <div style={{ ...pulse, width: 220, height: 28, marginBottom: 6 }} />
      <div style={{ ...pulse, width: 180, height: 14, marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {[0, 1, 2, 3].map(i => <div key={i} style={{ ...pulse, height: 72, borderRadius: 10 }} />)}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        {[120, 100, 90].map((w, i) => <div key={i} style={{ ...pulse, width: w, height: 38, borderRadius: 8 }} />)}
      </div>
      {[0, 1, 2].map(i => <div key={i} style={{ ...pulse, height: 52, borderRadius: 9, marginBottom: 7 }} />)}
    </div>
  )
}

const pulse: React.CSSProperties = {
  background: 'linear-gradient(90deg,#E8E5DF 25%,#D9D6CE 50%,#E8E5DF 75%)',
  backgroundSize: '200% 100%',
  animation: 'jf-pulse 1.4s ease-in-out infinite',
  borderRadius: 6,
  marginBottom: 12,
  height: 14,
}
