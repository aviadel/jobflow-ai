export default function SetupLoading() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={pulse} />
      <div style={{ ...pulse, width: 260, height: 28, marginBottom: 6 }} />
      <div style={{ ...pulse, width: 340, height: 14, marginBottom: 32 }} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ ...pulse, height: 64, borderRadius: 10, marginBottom: 10 }} />
      ))}
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
