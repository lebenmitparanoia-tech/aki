
'use client'
import React, {useEffect,useMemo,useRef,useState} from 'react'
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
  const [lastUpdated] = useState(() => new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZone:'Europe/Berlin'}))
  const [mode, setMode] = useState<'release'|'beta'>('release')
  const target = mode === 'release' ? releaseTarget : betaTarget
  const { days, hours, minutes, seconds } = useCountdown(target)

  // Capacity (Closed Beta)
  const totalSlots: number = 50;
  const slotsLeft: number = 48;
  const usedPct: number = Math.max(0, Math.min(100, Math.round(((totalSlots - slotsLeft) / totalSlots) * 100)));
  const overallPct: number = 40;


  const releaseDate = fmtDate(releaseTarget);
  const betaDate = fmtDate(betaTarget)

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
        <SegmentToggle/>
        <span className="topline-date">{(mode === 'release' ? releaseDate : betaDate) + ' · MESZ'}</span>
      </span>
    </div>
  )
  const SegmentToggle = () => (
    <div className="segment-toggle" role="tablist" aria-label="Ansicht wählen">
      <button role="tab" aria-selected={mode==='release'} onClick={()=>setMode('release')}>v1.0</button>
      <button role="tab" aria-selected={mode==='beta'} onClick={()=>setMode('beta')}>Closed&nbsp;Beta</button>
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
        <h2 className="section-title section-title--anim">Roadmap - Leben mit Paranoia</h2>
      <p className="section-sub">Plan bis v1.0 – Meilensteine, Fortschritt &amp; nächste Schritte.</p>
      <div className="section-divider" aria-hidden="true"></div>
      <span id="beta" />
      

<article className="card glass electric-border countdown-wide calm">
  <TopLine/>

  <div className="calm-grid">
    {/* LEFT: Countdown */}
    <div className="calm-left">
      <div className="calm-countdown" role="group" aria-label="Countdown" aria-live="polite" aria-atomic="true">
        <div className="calm-time">
          <span className="calm-digit digit-animated mono calm-digit--ddd">{String(days).padStart(3,'0')}</span>
          <span className="calm-label">Tage</span>
        </div>
        <span className="calm-sep" aria-hidden="true">:</span>
        <div className="calm-time">
          <span className="calm-digit digit-animated mono calm-digit--hh">{pad2(hours)}</span>
          <span className="calm-label">Std</span>
        </div>
        <span className="calm-sep" aria-hidden="true">:</span>
        <div className="calm-time">
          <span className="calm-digit digit-animated mono calm-digit--mm">{pad2(minutes)}</span>
          <span className="calm-label">Min</span>
        </div>
        <span className="calm-sep" aria-hidden="true">:</span>
        <div className="calm-time">
          <span className="calm-digit digit-animated mono calm-digit--ss">{pad2(seconds)}</span>
          <span className="calm-label">Sek</span>
        </div>
      </div>

      <div className="live-indicator calm-live">
        <span className="live-dot" aria-hidden="true"></span>
        <span className="live-text">Live‑View · zuletzt aktualisiert <strong>{lastUpdated}</strong> · {tz}</span>
      </div>
      <div className="overall">
        <div className="overall__head">
          <span className="overall__title">Nächster Meilenstein: Closed Beta</span>
          <span className="overall__val">{overallPct}%</span>
        </div>
        <div className="overall__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallPct}>
          <span style={{ width: `${overallPct}%` }} />
        </div>
      </div>
      
      <div className="announce" aria-labelledby="announce-title">
        <div className="announce__head">
          <h4 id="announce-title" className="announce__title">Closed Beta: So funktioniert’s</h4>
        </div>
        <ol className="announce__steps">
          <li><strong>Anmelden:</strong> Klicke auf „Werde Testnutzer:in“ und fülle das Formular aus.</li>
          <li><strong>Auswahl:</strong> Kleine Gruppe (Fokus: Stabilität &amp; UX) wird benachrichtigt.</li>
          <li><strong>Zugang:</strong> Du erhältst einen Einladungslink und ggf. einen Code (PWA/TestFlight/Android‑Beta).</li>
        </ol>
        <p className="announce__note">Datenschutzfreundlich • keine Werbung • Feedback fließt direkt ins Produkt.</p>
      </div>


    </div>

    {/* RIGHT: Capacity + CTA + Compact phases */}
    <div className="calm-right">
      <div className="capacity-box" role="region" aria-label="Beta-Kapazität">
        <div className="capacity-bar">
          <span className="capacity-fill" style={{ width: `${usedPct}%` }} />
        </div>
        <div className="capacity-meta">
          <strong>{slotsLeft} Beta‑Plätze frei</strong>
          <span className="muted">Begrenzte Gruppe für Stabilität &amp; UX</span>
        </div>
      </div>

      <div className="calm-ctas cta-row righted">
        <a href="#beta" className="btn-primary meta-cta">Werde Testnutzer:in</a>
        <a href="#support" className="btn-ghost">Unterstützen</a>
      </div>

      {/* Compact phase list to fill space calmly */}
      <div className="phase-mini">
        {([
          { title: 'Phase 1 – Aktueller Stand (Q3 2025)', value: 40 },
          { title: 'Phase 2 – Closed Beta (Q4 2025 – Q1 2026)', value: 0 },
          { title: 'Phase 3 – Open Beta (Q2 2026)', value: 0 },
          { title: 'Phase 4 – Security Review & Release v1.0 (Sommer 2026)', value: 0 },
          { title: 'Phase 5 – Weiterentwicklung (ab Herbst 2026)', value: 0 },
        ] as {title: string; value: number}[]).map((p, i) => (
          <div key={i} className="phase-mini__row">
            <div className="phase-mini__head">
              <div className="phase-mini__title">{p.title}</div>
              <div className="phase-mini__val">{p.value}%</div>
            </div>
            <div className="phase-mini__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p.value}>
              <span style={{ width: `${p.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</article>



      <div className="roadmap-copy">

      <div className="roadmap-grid">
        {/* Phase 1 */}
        <article className="roadmap-card card glass">
          <header className="card-head">
            <span className="icon-badge"><Icon name="info" size={18} /></span>
            <h3 className="card-title">Phase 1 – Aktueller Stand (Q3 2025)</h3>
          </header>
          <ul className="q-list">
            <li>Login &amp; Authentifizierung (Basis-Userkonten).</li>
            <li>Widgets (erste Bausteine) für Stimmungs- und Routine-Tracking.</li>
            <li>„Gesundheitsdaten teilen“ (End‑2‑End, Code‑basiert, DSGVO‑konform).</li>
            <li>Erste Designs &amp; Styleguide stehen.</li>
          </ul>
          <p className="card-text"><strong>Nächste Schritte:</strong> Usability‑Optimierungen, geschlossener Feedback‑Kanal, erste DSGVO‑konforme Export‑Funktion.</p>
        </article>

        {/* Phase 2 */}
        <article className="roadmap-card card glass">
          <header className="card-head">
            <span className="icon-badge"><Icon name="bell" size={18} /></span>
            <h3 className="card-title">Phase 2 – Closed Beta (Q4 2025 – Q1 2026)</h3>
          </header>
          <ul className="q-list">
            <li>Limitierte Nutzergruppe (10–50 Tester:innen), Fokus: Stabilität &amp; UX.</li>
            <li>Tagebuch &amp; Stimmungsverlauf, Kalender mit Basiserinnerungen.</li>
            <li>Notfallkontakte, Begleiter Aki (erste Version), Logging &amp; Monitoring.</li>
          </ul>
        </article>

        {/* Phase 3 */}
        <article className="roadmap-card card glass">
          <header className="card-head">
            <span className="icon-badge"><Icon name="rocket" size={18} /></span>
            <h3 className="card-title">Phase 3 – Open Beta (Q2 2026)</h3>
          </header>
          <ul className="q-list">
            <li>Breitere Öffnung, Fokus: breites Feedback &amp; Stabilität.</li>
            <li>Medikationstracker, Skills-/Aufgabenverwaltung.</li>
            <li>Datenfreigaben an Angehörige (opt‑in) mit Protokoll; Roadmap &amp; Changelog.</li>
          </ul>
        </article>

        {/* Phase 4 */}
        <article className="roadmap-card card glass">
          <header className="card-head">
            <span className="icon-badge"><Icon name="shield" size={18} /></span>
            <h3 className="card-title">Phase 4 – Security Review &amp; Release v1.0 (Sommer 2026)</h3>
          </header>
          <ul className="q-list">
            <li>Externer Security Review (Datenschutz, Verschlüsselung, DSGVO).</li>
            <li>v1.0: Tagebuch, Kalender, Skills, Notfallkontakte, Vertrauenspersonen‑Freigabe, Aki‑Core, Doku &amp; Handbuch.</li>
          </ul>
        </article>

        {/* Phase 5 (full width) */}
        <article className="roadmap-card roadmap-card--full card glass">
          <header className="card-head">
            <span className="icon-badge"><Icon name="sparkles" size={18} /></span>
            <h3 className="card-title">Phase 5 – Weiterentwicklung (ab Herbst 2026)</h3>
          </header>
          <ul className="q-list">
            <li>PWA / Offline‑Modus; erweiterte Analysen (z. B. Schlaf/Stress/Stimmung).</li>
            <li>Mehrsprachigkeit; Barrierefreiheit.</li>
            <li>Kooperationen mit Beratungsstellen/Kliniken (Pilotprojekte).</li>
            <li>Langfristige Vision (2027+): B2B2C‑Lizenzen, Partnernetzwerk (ohne Werbung/Tracking), Community‑Funktionen.</li>
          </ul>
        </article>
      </div>

      </div>
    </div>
  <div className="spaced" style={{textAlign:'center'}}>
    <a className="btn btn-primary" href="/unterstuetzen">Unterstützen</a>
  </div>
</section>
  )
}
