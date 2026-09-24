'use client'
import { useState } from 'react'

export default function SecretGenerator() {
  const [value, setValue] = useState('')
  const [copied, setCopied] = useState(false)

  function generate() {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    setValue(Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''))
    setCopied(false)
  }

  async function copy() {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const el = document.createElement('textarea')
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
        <div style={{
          flex: 1, border: '1.5px solid var(--sbo)', borderRadius: 6,
          padding: '8px 12px', background: 'var(--sbg)',
          fontFamily: 'ui-monospace,monospace', fontSize: 12,
          color: value ? 'var(--t1)' : 'var(--t3)',
          wordBreak: 'break-all', lineHeight: 1.5, minHeight: 38,
          display: 'flex', alignItems: 'center',
        }}>
          {value || 'Click Generate to create a random value'}
        </div>
        <button
          type="button"
          onClick={generate}
          style={{
            padding: '0 14px', borderRadius: 6, border: '1.5px solid var(--b)',
            background: 'var(--b)', color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          Generate
        </button>
        {value && (
          <button
            type="button"
            onClick={copy}
            style={{
              padding: '0 14px', borderRadius: 6, border: '1.5px solid var(--sbo)',
              background: copied ? 'var(--okl)' : 'var(--ca)', color: copied ? 'var(--ok)' : 'var(--t2)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
              transition: 'all .15s',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      {value && (
        <p style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>
          Copy this value and paste it into Vercel as <code style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11 }}>INTERNAL_SECRET</code>.
          Keep it secret - do not share it.
        </p>
      )}
    </div>
  )
}
