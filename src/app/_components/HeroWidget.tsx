'use client'

import { useState, useEffect, useRef } from 'react'

const KEYS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V']
const LINE_WIDTHS = [45, 75, 60, 80, 50, 70, 55, 65, 40, 72, 58, 68]
const TOTAL_LINES = LINE_WIDTHS.length

type Phase = 'typing' | 'formatting' | 'done' | 'resetting'

const CSS = `
.tw-scene{position:relative;width:100%;max-width:480px;margin:0 auto;padding-top:30px;padding-bottom:80px}

/* character */
.tw-char{position:absolute;top:-20px;left:50%;transform:translateX(-50%);z-index:10;text-align:center}
.tw-logo{width:72px;height:72px;background:linear-gradient(145deg,#1E293B,#0F172A);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.3),0 0 0 2px rgba(96,165,250,.2),inset 0 1px 0 rgba(255,255,255,.05);animation:twbob 3s ease-in-out infinite;margin:0 auto}
.tw-lsvg{width:36px;height:36px}
.tw-label{font-size:.6rem;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-top:8px}
.tw-arms{display:flex;justify-content:center;gap:52px;margin-top:-8px}
.tw-arm{width:18px;height:18px;background:linear-gradient(145deg,#1E293B,#0F172A);border-radius:50%;animation:twarm .35s ease-in-out infinite alternate;box-shadow:0 3px 8px rgba(0,0,0,.25),0 0 0 1.5px rgba(96,165,250,.12)}
.tw-arm:nth-child(2){animation-delay:.18s}
.tw-arm-pause{animation:none!important}
@keyframes twbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes twarm{0%{transform:translateY(0)}100%{transform:translateY(4px)}}

/* machine */
.tw-machine{position:relative;margin-top:68px}
.tw-roller{background:var(--ca);border:1.5px solid var(--bo);border-radius:var(--r2) var(--r2) 0 0;height:12px;display:flex;align-items:center;justify-content:center;gap:5px}
.tw-rdot{width:5px;height:5px;border-radius:50%;background:var(--bo)}
.tw-slot{position:relative;overflow:hidden;height:260px;z-index:2;perspective:800px;margin:0 10px}

/* paper */
.tw-paper{position:absolute;bottom:0;left:0;right:0;min-height:400px;transform-style:preserve-3d}
.tw-pback,.tw-pfront{position:absolute;top:0;left:0;right:0;bottom:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border:1px solid var(--bo);border-radius:2px}
.tw-pback{background:linear-gradient(180deg,#fafaf9,#f5f5f4);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;padding:30px}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .tw-pback{background:linear-gradient(180deg,#1e2d42,#1a2636)}}
:root[data-theme="dark"] .tw-pback{background:linear-gradient(180deg,#1e2d42,#1a2636)}
.tw-pfront{background:#fff;padding:20px 18px;transform:rotateY(180deg)}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .tw-pfront{background:#1a2332}}
:root[data-theme="dark"] .tw-pfront{background:#1a2332}
.tw-pline{height:2px;background:var(--bo);border-radius:1px;opacity:0;transition:opacity .3s}
.tw-pline-v{opacity:1}

/* cv content */
.tw-pc{font-family:'Courier New',Courier,monospace;font-size:.67rem;line-height:1.8;color:var(--t3)}
.tw-pc-h{font-weight:800;font-size:.77rem;color:var(--t1);text-transform:uppercase;letter-spacing:.05em}
.tw-pc-s{font-weight:700;color:var(--b);font-size:.65rem;margin-top:4px;text-transform:uppercase;letter-spacing:.06em;display:block}
.tw-pc-b{padding-left:10px;display:block}
.tw-pc-b::before{content:"- ";color:var(--b)}
.tw-pc-d{border:none;border-top:1px dashed var(--bo);margin:4px 0}

/* keyboard */
.tw-keys{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;padding:12px 0 8px}
.tw-key{width:26px;height:24px;background:var(--ca);border:1.5px solid var(--bo);border-radius:4px;font-size:.58rem;display:flex;align-items:center;justify-content:center;color:var(--t3);font-weight:700;box-shadow:0 2px 0 var(--bo);transition:transform .05s,box-shadow .05s,background .05s,border-color .05s,color .05s}
.tw-key-p{transform:translateY(2px);box-shadow:none;background:var(--b50);border-color:var(--b);color:var(--b)}

/* machine body */
.tw-mbody{background:var(--bg2);border:1.5px solid var(--bo);border-radius:0 0 var(--r3) var(--r3);padding:0 8px 8px;box-shadow:var(--sl);margin-top:-1px}

/* status bar */
.tw-sbar{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:var(--ca);border:1.5px solid var(--bo);border-top:none;border-radius:0 0 var(--r2) var(--r2);font-size:.72rem;margin:0}
.tw-sleft{display:flex;align-items:center;gap:8px}
.tw-sdot{width:8px;height:8px;border-radius:50%;background:#D97706;animation:twpulse 1.5s infinite}
.tw-sdot-done{background:var(--ok);animation:none}
@keyframes twpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
.tw-stxt{color:var(--t3);font-weight:600}
.tw-stime{color:var(--b);font-weight:700;font-variant-numeric:tabular-nums}

/* result card */
.tw-res{position:absolute;bottom:20px;left:10px;right:10px;background:var(--ca);border:2px solid var(--ok);border-radius:var(--r2);padding:16px;box-shadow:var(--sl),0 0 30px rgba(37,99,235,.10);opacity:0;transform:translateY(30px) scale(.95);transition:all .6s cubic-bezier(.34,1.56,.64,1);z-index:20;pointer-events:none}
.tw-res-v{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
.tw-rh{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--bo)}
.tw-ric{width:36px;height:36px;background:var(--okl);border-radius:var(--r1);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.tw-ri h4{font-size:.82rem;font-weight:700;color:var(--t1);margin:0}
.tw-ri span{font-size:.68rem;color:var(--ok);font-weight:600}
.tw-rb{display:flex;gap:6px;margin-bottom:8px}
.tw-rbp,.tw-rbg{padding:5px 12px;border-radius:var(--r1);font-size:.7rem;font-weight:600;border:none;cursor:pointer;font-family:inherit}
.tw-rbp{background:var(--b);color:#fff}
.tw-rbg{background:var(--bg2);color:var(--t3)}
.tw-clr{display:flex;align-items:center;gap:8px;padding-top:8px;border-top:1px solid var(--bo)}
.tw-clic{width:28px;height:28px;background:var(--b50);border-radius:var(--r1);display:flex;align-items:center;justify-content:center;font-size:.75rem;flex-shrink:0}
.tw-cli{font-size:.72rem;font-weight:600;color:var(--t3)}
.tw-cli strong{color:var(--t1)}

@media(prefers-reduced-motion:reduce){
  .tw-logo,.tw-arm,.tw-sdot{animation:none!important}
  .tw-paper,.tw-res,.tw-pline{transition:none!important}
}
`

export default function HeroWidget() {
  const [phase, setPhase] = useState<Phase>('typing')
  const [pressedKey, setPressedKey] = useState<number | null>(null)
  const [visibleLines, setVisibleLines] = useState(0)
  const [paperTranslate, setPaperTranslate] = useState(20)
  const [elapsed, setElapsed] = useState('0.0s')
  const [flipped, setFlipped] = useState(false)
  const [resultVisible, setResultVisible] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const keyRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lineRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const startRef = useRef(0)

  const clearAll = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (keyRef.current) clearInterval(keyRef.current)
    if (lineRef.current) clearInterval(lineRef.current)
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timeoutsRef.current.push(t)
  }

  const startAnimation = () => {
    clearAll()
    setPhase('typing')
    setFlipped(false)
    setResultVisible(false)
    setVisibleLines(0)
    setPaperTranslate(20)
    setElapsed('0.0s')
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      setElapsed(((Date.now() - startRef.current) / 1000).toFixed(1) + 's')
    }, 100)

    keyRef.current = setInterval(() => {
      const idx = Math.floor(Math.random() * KEYS.length)
      setPressedKey(idx)
      setTimeout(() => setPressedKey(p => p === idx ? null : p), 100)
    }, 120)

    let line = 0
    lineRef.current = setInterval(() => {
      if (line < TOTAL_LINES) {
        line++
        setVisibleLines(line)
        setPaperTranslate(20 + (line / TOTAL_LINES) * 200)
      }
    }, 350)

    // finish typing → formatting → flip → result → reset
    later(() => {
      clearAll()
      setPhase('formatting')
      later(() => {
        setFlipped(true)
        setPhase('done')
        later(() => {
          setResultVisible(true)
          later(() => {
            // reset — no transition so paper snaps back instantly
            setResultVisible(false)
            setPhase('resetting')
            setFlipped(false)
            setPaperTranslate(20)
            later(() => startAnimation(), 600)
          }, 5000)
        }, 1200)
      }, 800)
    }, 4500)
  }

  useEffect(() => {
    startAnimation()
    return clearAll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusText: Record<Phase, string> = {
    typing: 'Claude is typing...',
    formatting: 'Formatting document...',
    done: 'Done - documents ready',
    resetting: 'Done - documents ready',
  }

  const isDone = phase === 'done' || phase === 'resetting'

  const paperStyle: React.CSSProperties = {
    transform: flipped
      ? 'translateY(-10%) rotateY(180deg)'
      : `translateY(calc(100% - ${paperTranslate}px))`,
    transition: phase === 'resetting'
      ? 'none'
      : flipped
        ? 'transform 1.2s cubic-bezier(0.4,0,0.2,1)'
        : 'transform 1.2s cubic-bezier(0.22,1,0.36,1)',
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="tw-scene" role="img" aria-label="Animation: JobFlow AI generating a tailored CV">

        {/* Logo character */}
        <div className="tw-char">
          <div className="tw-logo" aria-hidden="true">
            <svg className="tw-lsvg" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" fill="#93C5FD"/>
              <circle cx="6" cy="12" r="3" fill="#93C5FD"/>
              <circle cx="18" cy="19" r="3" fill="#93C5FD"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="tw-label">JobFlow AI</div>
          <div className="tw-arms" aria-hidden="true">
            <div className={`tw-arm${phase !== 'typing' ? ' tw-arm-pause' : ''}`} />
            <div className={`tw-arm${phase !== 'typing' ? ' tw-arm-pause' : ''}`} />
          </div>
        </div>

        {/* Typewriter machine */}
        <div className="tw-machine">
          <div className="tw-roller">
            {[0,1,2,3,4].map(i => <div key={i} className="tw-rdot" />)}
          </div>

          <div className="tw-slot">
            <div className="tw-paper" style={paperStyle}>
              {/* Back face — visible while typing */}
              <div className="tw-pback">
                {LINE_WIDTHS.map((w, i) => (
                  <div
                    key={i}
                    className={`tw-pline${i < visibleLines ? ' tw-pline-v' : ''}`}
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              {/* Front face — CV content revealed after flip */}
              <div className="tw-pfront">
                <div className="tw-pc">
                  <div className="tw-pc-h">CURRICULUM VITAE</div>
                  <hr className="tw-pc-d" />
                  <span className="tw-pc-s">PROFESSIONAL SUMMARY</span>
                  <span>Senior Software Engineer with 8+</span>
                  <span>years building distributed systems</span>
                  <span>at scale. Go, AWS, Kubernetes.</span>
                  <hr className="tw-pc-d" />
                  <span className="tw-pc-s">TECHNICAL SKILLS</span>
                  <span className="tw-pc-b">Go, Python, TypeScript</span>
                  <span className="tw-pc-b">AWS, GCP, Kubernetes, Docker</span>
                  <span className="tw-pc-b">PostgreSQL, Redis, Kafka</span>
                  <hr className="tw-pc-d" />
                  <span className="tw-pc-s">EXPERIENCE</span>
                  <span>Lead Engineer - Acme Corp</span>
                  <span className="tw-pc-b">Led migration to microservices</span>
                  <span className="tw-pc-b">Reduced latency by 40%</span>
                  <span className="tw-pc-b">Managed team of 6 engineers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-mbody">
            <div className="tw-keys" aria-hidden="true">
              {KEYS.map((k, i) => (
                <div key={i} className={`tw-key${pressedKey === i ? ' tw-key-p' : ''}`}>{k}</div>
              ))}
            </div>
            <div className="tw-sbar">
              <div className="tw-sleft">
                <div className={`tw-sdot${isDone ? ' tw-sdot-done' : ''}`} />
                <span className="tw-stxt">{statusText[phase]}</span>
              </div>
              <span className="tw-stime">{elapsed}</span>
            </div>
          </div>
        </div>

        {/* Result card */}
        <div className={`tw-res${resultVisible ? ' tw-res-v' : ''}`}>
          <div className="tw-rh">
            <div className="tw-ric">&#128196;</div>
            <div className="tw-ri">
              <h4>senior_engineer_cv.docx</h4>
              <span>&#10003; Ready to download</span>
            </div>
          </div>
          <div className="tw-rb">
            <button className="tw-rbp">.docx &#8595;</button>
            <button className="tw-rbg">Preview</button>
          </div>
          <div className="tw-clr">
            <div className="tw-clic">&#9993;</div>
            <div className="tw-cli"><strong>cover_letter.docx</strong> &#10003; Generated</div>
          </div>
        </div>
      </div>
    </>
  )
}
