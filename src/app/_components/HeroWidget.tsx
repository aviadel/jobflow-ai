'use client'

import { useState, useEffect } from 'react'

const LogoSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="18" cy="5" r="3" fill="#93C5FD"/>
    <circle cx="6" cy="12" r="3" fill="#93C5FD"/>
    <circle cx="18" cy="19" r="3" fill="#93C5FD"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const KEYS = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V']
const PHASE_SHOW_MS = [2400, 3200, 2600]
const FADE_MS = 380

export default function HeroWidget() {
  const [phase, setPhase] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let fadeOut: ReturnType<typeof setTimeout>
    let advance: ReturnType<typeof setTimeout>

    fadeOut = setTimeout(() => {
      setFading(true)
      advance = setTimeout(() => {
        setPhase(p => (p + 1) % 3)
        setFading(false)
      }, FADE_MS)
    }, PHASE_SHOW_MS[phase])

    return () => { clearTimeout(fadeOut); clearTimeout(advance) }
  }, [phase])

  const sub = ['Decoding job description…', 'Writing CV…', 'Documents ready'][phase]

  return (
    <div
      className="jtw"
      role="img"
      aria-label="JobFlow AI generating a tailored CV"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }}
    >
      {/* Header - consistent across all phases */}
      <div className="jtwh">
        <div className="jtwwho">
          <div className="jtwav"><LogoSvg /></div>
          <div>
            <div className="jtwname">JobFlow AI</div>
            <div className="jtwsub">{sub}</div>
          </div>
        </div>
        {phase === 2
          ? <span className="jtwbadge">&#10003; Done</span>
          : <span className="jtwbadge-ld"><span className="jdbt" />{phase === 0 ? 'Analyzing' : 'Writing'}</span>
        }
      </div>

      {/* ── Phase 0: JD decode ── */}
      {phase === 0 && (
        <div className="jjdc">
          <div className="jjdtop">
            <span className="jjdic">📋</span>
            <div>
              <div className="jjdtitle">Senior Software Engineer</div>
              <div className="jjdco">Stripe &middot; Remote</div>
            </div>
          </div>
          <div className="jjtags">
            {['Python', 'AWS', 'Go', 'Distributed Systems', '5+ yrs'].map(t => (
              <span key={t} className="jjtag">{t}</span>
            ))}
          </div>
          <div className="jjfit">
            <span className="jjfitl">Fit</span>
            <div className="jjfitbar"><div className="jjfitfill" /></div>
            <span className="jjfitp">82%</span>
          </div>
          <div className="jjfitmatch">Strong match &middot; 4 of 5 key requirements met</div>
        </div>
      )}

      {/* ── Phase 1: Writing CV ── */}
      {phase === 1 && (
        <>
          <div className="jpaper" style={{ maxHeight: 120 }}>
            <div className="jcvn">Alex Rivera</div>
            <div className="jcvm">Senior Software Engineer &middot; London, UK</div>
            <div className="jcvd" />
            <div className="jcvs">Professional Summary</div>
            <div className="jcvl">
              Senior engineer with 8+ years building distributed systems. Go, AWS, Kubernetes.
              <span className="jcursor" />
            </div>
          </div>
          <div className="jkeys" aria-hidden="true">
            {KEYS.map((k, i) => (
              <div key={i} className={`jkey${['E','R','T','I','S','K','C','N'].includes(k) ? ' jon' : ''}`}>{k}</div>
            ))}
          </div>
          <div className="jtwst">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="jsdot jsdot-ld" />
              <span className="jstxt">Writing section 2 of 5&hellip;</span>
            </div>
          </div>
        </>
      )}

      {/* ── Phase 2: Done ── */}
      {phase === 2 && (
        <>
          <div className="jpaper">
            <div className="jcvn">Alex Rivera</div>
            <div className="jcvm">Senior Software Engineer &middot; London, UK</div>
            <div className="jcvd" />
            <div className="jcvs">Professional Summary</div>
            <div className="jcvl">Senior engineer with 8+ years building distributed systems. Go, AWS, Kubernetes. Led team delivering 40% API latency reduction.</div>
            <div className="jcvd" />
            <div className="jcvs">Technical Skills</div>
            <div className="jcvl">Go &middot; Python &middot; TypeScript &middot; AWS &middot; GCP &middot; Kubernetes &middot; PostgreSQL &middot; Redis</div>
          </div>
          <div className="jtwst">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="jsdot" />
              <span className="jstxt">Done - documents ready</span>
            </div>
            <span className="jstm">1.8s</span>
          </div>
          <div className="jcvout">
            <div className="jcvouth">
              <div className="jcvic">&#128196;</div>
              <div className="jcvinfo">
                <h4>senior_engineer_cv.docx</h4>
                <span>&#10003; Ready to download</span>
              </div>
            </div>
            <div className="jcvbtns">
              <button className="jcvb jcvbp">.docx &#8595;</button>
              <button className="jcvb jcvbg">Preview</button>
            </div>
            <div className="jclr">
              <div className="jclic">&#9993;</div>
              <span><strong>cover_letter.docx</strong>&nbsp;&nbsp;&#10003; Generated</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
