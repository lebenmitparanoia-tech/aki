
import React from 'react'
import './countdown-split-ready.css'

function useNow(){ const [n,setN]=React.useState(Date.now()); React.useEffect(()=>{ const id=setInterval(()=>setN(Date.now()),1000); return ()=>clearInterval(id)},[]); return n }
function useCountdown(targetMs){
  const now = useNow()
  const total = Math.max(0, targetMs - now)
  const s = Math.floor(total/1000)
  const days = Math.floor(s/86400)
  const hrs  = Math.floor((s%86400)/3600)
  const mins = Math.floor((s%3600)/60)
  const secs = s%60
  // Fractions for rings
  const minuteFrac = (now % 60000) / 60000
  const hourFrac   = (now % 3600000) / 3600000
  const dayFrac    = (now % 86400000) / 86400000
  return { now, days, hrs, mins, secs, minuteFrac, hourFrac, dayFrac }
}
const pad2 = n => n.toString().padStart(2,'0')

function Circle({ value, label, progress=0, glow=0, glowStrong=false, isSeconds=false }){
  const size=132, r=54, c=2*Math.PI*r
  const dash=Math.max(0,Math.min(1,progress))*c
  const offset=c-dash
  return (
    <div className="circleTile" role="group" aria-label={`${label} ${value}`}>
      <svg width={size} height={size} viewBox="0 0 132 132" aria-hidden>
        <defs>
          <linearGradient id="akiStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9fd0ff"/>
            <stop offset="100%" stopColor="#4da3ff"/>
          </linearGradient>
          <filter id="akiGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.65 0"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="66" cy="66" r={r} fill="none" stroke="#1b2430" strokeWidth="10"/>
        <circle cx="66" cy="66" r={r} fill="none" stroke="url(#akiStroke)"
          strokeWidth="10" strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" style={{transition:'stroke-dashoffset .6s ease'}}/>
        <circle cx="66" cy="66" r={r} fill="none" stroke="url(#akiStroke)"
          strokeWidth="10" strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" filter="url(#akiGlow)"
          style={{opacity: Math.max(0, Math.min(1, glowStrong ? glow : glow*0.6))}}/>
      </svg>
      <div className="circleLabel">
        <div className={`num ${isSeconds?'secs':''}`}>{value}</div>
        <div className="unit">{label}</div>
      </div>
    </div>
  )
}

export default function CountdownSplitReady(){
  // === Deine festen Werte (aus der Nachricht) ===
  const plannedISO = '2026-08-01T00:00:00+02:00' // v1.0 Release
  const chips = ['v1.0', 'Closed Beta ab 01.11.2025', '01.08.2026 · MESZ']
  const milestoneText = 'Nächster Meilenstein: Closed Beta (Start 01.11.2025). Werde Teil der Testgruppe.'
  const ctaHref = '#beta'
  const ctaLabel = 'Werde Testnutzer'
  const betaSpotsLabel = '48 Beta-Plätze'
  const phases = [
    { id:'p1', title:'Phase 1 – Aktueller Stand (Q3 2025)', pct:40 },
    { id:'p2', title:'Phase 2 – Closed Beta (Q4 2025 – Q1 2026)', pct:0 },
    { id:'p3', title:'Phase 3 – Open Beta (Q2 2026)', pct:0 },
    { id:'p4', title:'Phase 4 – Security Review & Release v1.0 (Sommer 2026)', pct:0 },
    { id:'p5', title:'Phase 5 – Weiterentwicklung (ab Herbst 2026)', pct:0 },
  ]
  const timezoneLabel = 'MESZ'

  const target = new Date(plannedISO).getTime()
  const { now, days, hrs, mins, secs, minuteFrac, hourFrac, dayFrac } = useCountdown(target)
  const lastUpdated = new Date(now).toLocaleTimeString('de-DE', { hour12:false })
  const aria = `${days} Tage, ${hrs} Stunden, ${mins} Minuten, ${secs} Sekunden`

  return (
    <section className="countdownSplitReady" aria-label="Roadmap – Countdown & Phasen">
      <aside className="left card" aria-label="Phasenfortschritt">
        <div className="liveRow" aria-label="Live Status">
          <span className="livePill"><span className="liveDot" aria-hidden/> LIVE</span>
          <span className="meta">Wird mehrmals wöchentlich aktualisiert</span>
        </div>

        <ul className="phaseList">
          {phases.map(ph => (
            <li className="phase" key={ph.id}>
              <div className="phaseHeader">
                <div className="phaseTitle">{ph.title}</div>
                <div className="phasePct">{ph.pct}%</div>
              </div>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ph.pct}>
                <i style={{'--pct': ph.pct + '%'}}/>
              </div>
            </li>
          ))}
        </ul>

        <div className="leftFoot">
          <div className="meta">Zuletzt aktualisiert: {lastUpdated} · Zeitzone: {timezoneLabel}</div>
          <div className="meta note">Hinweis: Plan kann sich ändern.</div>
        </div>
      </aside>

      <div className="right card" aria-label="Countdown & Aktionen">
        <div className="chips" role="tablist">
          {chips.map((c,i)=>(
            <button key={i} className={`chip ${i===0?'is-active':''}`} role="tab" aria-selected={i===0}>{c}</button>
          ))}
        </div>

        <div className="circleRow" aria-live="polite" aria-label={aria}>
          <Circle value={days}      label="Tage"    progress={dayFrac} />
          <Circle value={pad2(hrs)} label="Stunden" progress={hourFrac} />
          <Circle value={pad2(mins)}label="Minuten" progress={minuteFrac} glow={1-minuteFrac} glowStrong />
          <Circle value={pad2(secs)}label="Sekunden" progress={(secs%60)/60} isSeconds />
        </div>

        <div className="time-rail"><i style={{'--p':'var(--pGoal,72%)'}}/></div>

        <p className="milestone">{milestoneText}</p>
        <div className="actions">
          <a className="btn" href={ctaHref}>{ctaLabel}</a>
          <span className="badge">{betaSpotsLabel}</span>
          <a className="link" href={`/api/release-ics?title=${encodeURIComponent('Aki v1.0')}&date=${encodeURIComponent(plannedISO)}`}>.ics speichern</a>
        </div>
      </div>
    </section>
  )
}
