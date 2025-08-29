
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'

const releaseTarget = new Date('2026-08-01T00:00:00')
const betaTarget = new Date('2025-11-01T00:00:00') // Closed Beta: 01.11.2025

function fmtDate(d: Date){
  return d.toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric', timeZone: 'Europe/Berlin' })
}

function useCountdown(target: Date){
  const get = () => {
    const now = new Date().getTime()
    const diff = Math.max(0, target.getTime() - now)
    const days = Math.floor(diff / (1000*60*60*24))
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60))
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60))
    const seconds = Math.floor((diff % (1000*60)) / 1000)
    return { days, hours, minutes, seconds, diff }
  }
  const [state, setState] = useState(get())
  useEffect(() => {
    const id = setInterval(() => setState(get()), 1000)
    return () => clearInterval(id)
  }, [target])
  return state
}

function pad2(n: number){ return String(n).padStart(2,'0') }

export default function Roadmap(){
  const tz = 'MESZ'
  const lastUpdated = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone:'Europe/Berlin'})
  const [mode, setMode] = useState<'release'|'beta'>('release')
  const target = mode === 'release' ? releaseTarget : betaTarget
  const { days, hours, minutes, seconds } = useCountdown(target)

  const releaseLabel = `v1.0 am ${fmtDate(releaseTarget)}`
  const betaLabel = `Closed Beta am ${fmtDate(betaTarget)}`

  const phases = useMemo(() => ([
    { title: 'Phase 1 – Aktueller Stand (Q3 2025)', value: 70, icon:'info' },
    { title: 'Phase 2 – Closed Beta (Q4 2025 – Q1 2026)', value: 30, icon:'bell' },
    { title: 'Phase 3 – Open Beta (Q2 2026)', value: 0, icon:'rocket' },
    { title: 'Phase 4 – Security Review & Release v1.0 (Sommer 2026)', value: 0, icon:'shield' },
    { title: 'Phase 5 – Weiterentwicklung (ab Herbst 2026)', value: 0, icon:'sparkles' },
  ]), [])

  const TopLine = () => (
    <div className="countdown-topline">
      <span className="topline-left">
        <span className="icon-badge"><Icon name="info" size={18} /></span>
        <strong>Release-Countdown</strong>
      </span>
      <span className="topline-text">
        <strong>{mode === 'release' ? 'v1.0' : 'Closed Beta'}</strong> am <span className="topline-date">{mode === 'release' ? releaseLabel : betaLabel}</span>
      </span>
    </div>
  )

  const SegmentToggle = () => (
    <div className="segment-toggle" role="tablist" aria-label="Ansicht wählen">
      <button role="tab" aria-selected={mode==='release'} onClick={()=>setMode('release')}>bis v1.0</button>
      <button role="tab" aria-selected={mode==='beta'} onClick={()=>setMode('beta')}>bis Closed&nbsp;Beta</button>
    </div>
  )

  // build dial ticks helpers
  const DialTicks = ({activeFrom=0, arcGap=5, secMode=false}: {activeFrom?:number, arcGap?:number, secMode?:boolean}) => {
    const arr = Array.from({length:60})
    return (
      <>
        {arr.map((_, i) => {
          if (i < arcGap || i >= 60-arcGap) return null
          const a = (i/60)*Math.PI*2 - Math.PI/2
          const x = 50 + 44*Math.cos(a)
          const y = 50 + 44*Math.sin(a)
          let op = .35
          if (secMode){
            // fade down: only first "seconds" ticks stay brighter
            const secondsRemaining = seconds // 59..0
            op = i < secondsRemaining ? .9 : .06
          }
          return <circle key={i} cx={x} cy={y} r={1.4} className="tick" opacity={op}/>
        })}
      </>
    )
  }

  return (
    <section id="roadmap" className="roadmap spaced">
      <div className="container">
        <TopLine/>
        <div className="top-grid">
          <div className="top-left">
            <SegmentToggle/>
          </div>
          <div className="top-right">
            <div className="timer-meta top-tight">
              <div className="countdown-row" role="group" aria-label="Countdown">
                <div className="dial" aria-label="Tage">
                  <svg viewBox="0 0 100 100" className="dial-svg" aria-hidden="true">
                    <circle className="dial-track" cx="50" cy="50" r="44"/>
                    <DialTicks activeFrom={0} arcGap={5} />
                  </svg>
                  <div className="dial-num">{pad2(days)}</div>
                  <div className="dial-label">Tage</div>
                </div>
                <div className="dial" aria-label="Stunden">
                  <svg viewBox="0 0 100 100" className="dial-svg" aria-hidden="true">
                    <circle className="dial-track" cx="50" cy="50" r="44"/>
                    <DialTicks activeFrom={0} arcGap={5} />
                  </svg>
                  <div className="dial-num">{pad2(hours)}</div>
                  <div className="dial-label">Stunden</div>
                </div>
                <div className="dial" aria-label="Minuten">
                  <svg viewBox="0 0 100 100" className="dial-svg" aria-hidden="true">
                    <circle className="dial-track" cx="50" cy="50" r="44"/>
                    <DialTicks activeFrom={0} arcGap={5} />
                  </svg>
                  <div className="dial-num">{pad2(minutes)}</div>
                  <div className="dial-label">Minuten</div>
                </div>
                <div className="dial" aria-label="Sekunden">
                  <svg viewBox="0 0 100 100" className="dial-svg" aria-hidden="true">
                    <circle className="dial-track" cx="50" cy="50" r="44"/>
                    <DialTicks secMode arcGap={5} />
                  </svg>
                  <div className="dial-num">{pad2(seconds)}</div>
                  <div className="dial-label">Sekunden</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="countdown-layout bottom">
      <div className="progress-col">
        {
          phases.map((p, idx) => (
            <div key={p.title} className={`progress-row ${idx===1 ? 'active' : ''}`}>
              <div className="progress-head">
                <div className="progress-title">{p.title}</div>
                <div className="progress-val">{p.value}%</div>
              </div>
              <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.value}>
                <span style={{width: `${p.value}%`}} />
              </div>
            </div>
          ))
        }
        <div className="minis">
          <span className="mini"><strong>Zuletzt aktualisiert:</strong> {lastUpdated}</span>
          <span className="mini">Zeitzone: <strong>{tz}</strong></span>
          <span className="mini">Hinweis: Plan kann sich ändern</span>
        </div>
      </div>

      <div className="countdown-meta righted tight">
        <p className="meta-text"><strong>Nächster Meilenstein: Closed Beta</strong> (Q4 2025–Q1 2026). Werde Teil der Testgruppe.</p>
        <div className="cta-row righted">
          <span className="chip chip-badge">48 Beta‑Plätze</span>
          <a href="#beta" className="btn-primary meta-cta">Werde Testnutzer</a>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}
