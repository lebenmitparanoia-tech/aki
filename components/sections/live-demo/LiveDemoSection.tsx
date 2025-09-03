'use client'
import React, { useEffect, useRef, useState } from 'react'

type ExerciseId = 'breath' | 'body' | 'noise' | 'ground'

type Exercise = {
  id: ExerciseId
  icon: string
  title: string
  subtitle?: string
  description: string
  durationSec: number
}

const EXERCISES: Exercise[] = [
  { id: 'breath', icon: '🌬️', title: 'Atem-Reset', subtitle: '≈ 60s', durationSec: 60,
    description: 'Ein kurzer Atem-Reset. Keine Cookies, kein Tracking – einfach ausprobieren.' },
  { id: 'body', icon: '🧘', title: 'Kompakter Körper-Scan', subtitle: '≈ 60s', durationSec: 60,
    description: 'Einmal vom Kopf bis Fuß gehen, Anspannung lokalisieren und loslassen.' },
  { id: 'noise', icon: '🎧', title: 'Leise Geräuschkulisse', subtitle: '≈ 30s', durationSec: 30,
    description: 'Ein bisschen akustischer Schutz – Ambience: Regen, Ozean, Wald sowie White/Brown/Pink.' },
  { id: 'ground', icon: '🧭', title: '5–4–3–2–1 Grounding', subtitle: '≈ 60s', durationSec: 60,
    description: 'Schnelle Erdung: 5 sehen, 4 fühlen, 3 hören, 2 riechen, 1 schmecken.' },
]

const QUOTES: Record<ExerciseId, string[]> = {
  breath: [
    'Lass uns sanft beginnen.', 'Ganz ruhig: ein… und aus.',
    'Du musst nichts leisten – nur atmen.', 'Dein Tempo ist genau richtig.',
    'Spür, wie der Atem Platz schafft.', 'Sanft ein – noch sanfter aus.',
    'Nur dieser Atemzug zählt.', 'Mit jedem Ausatmen ein kleines Loslassen.',
    'Gut so – bleib bei dir.', 'Stabil wie eine Welle: ein und aus.',
    'Weich im Gesicht, locker im Kiefer.', 'Deine Schultern dürfen sinken.',
  ],
  body: [
    'Wir gehen achtsam von oben nach unten.', 'Sei neugierig, nicht streng.',
    'Spür zuerst die Stirn – weich werden.', 'Kiefer lösen, ganz locker.',
    'Schultern dürfen sinken.', 'Lass den Brustkorb breit werden.',
    'Der Bauch darf weich sein.', 'Bis zu den Füßen: warm & sicher.',
    'Kleine Schritte – große Wirkung.', 'Sehr gut – du hörst deinem Körper zu.',
    'Wo Spannung ist, darf Raum entstehen.', 'Danke, dass du dir Zeit gibst.',
  ],
  noise: [
    'Ein sanfter Klangteppich für dich.', 'Lass Geräusche dich tragen.',
    'Wie ein akustischer Schirm.', 'Nur so laut, wie es gut tut.',
    'Heute darf es leicht sein.', 'Du entscheidest, was nah sein darf.',
    'Wir schützen deine Ruhe.', 'Es ist okay, Unterstützung zu nutzen.',
    'Ein bisschen Weichzeichner fürs Hören.', 'Leise genug, um zu entspannen.',
  ],
  ground: [
    'Wir verankern dich im Hier & Jetzt.', 'Blick langsam umher – ganz ohne Eile.',
    'Spüren statt bewerten.', 'Deine Umgebung trägt dich.',
    'Du bist nicht allein – ich bin bei dir.', 'Ein Schritt nach dem anderen.',
    'Sammle Eindrücke, nicht Gedanken.', 'Atme – und nimm wahr.',
    'Fein gemacht – weiter so.', 'Sicherheit wächst mit jedem Schritt.',
  ],
}

/** Aki-Grafiken (Dateinamen aus deiner ZIP) */
const AKI_VARIANTS = [{"img": "/aki/graphics/aki-hyped.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-looking-front.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-lying-on-back.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-lying-paws-together.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-lying-side-2.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-lying-side.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-play-with-ball.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-sit-front.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-stretch.svg", "quotes": ["Weiter so."]}, {"img": "/aki/graphics/aki-thinking.svg", "quotes": ["Weiter so."]}] as const

const findCalmIndex = () => 0
const pickNext = (i:number) => (i + 1) % AKI_VARIANTS.length

function playPlopp(){
  try {
    const ctx = new (window as any).AudioContext()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(520, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.2)
    setTimeout(() => ctx.close().catch(()=>{}), 300)
  } catch {}
}

function useTimer(duration: number){
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const raf = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) { if (raf.current) cancelAnimationFrame(raf.current); return }
    const tick = (t:number) => {
      if (startRef.current == null) startRef.current = t
      const e = (t - startRef.current) / 1000
      const clamped = Math.min(duration, e)
      setElapsed(clamped)
      if (clamped >= duration) { setRunning(false); startRef.current = null; return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [running, duration])

  const progress = Math.min(1, elapsed / duration)
  const remaining = Math.max(0, Math.ceil(duration - elapsed))
  const reset = () => { setRunning(false); setElapsed(0); startRef.current = null }
  return { running, setRunning, progress, remaining, reset, elapsed }
}

// Instruction helpers (per full second)
const breathInstructionAt = (sec:number) => { const m = sec % 13; if (m<4) return 'Einatmen'; if (m<5) return 'Kurz halten'; if (m<11) return 'Langsam ausatmen'; return 'Pause' }
const bodyInstructionAt = (sec:number) => { if (sec<15) return 'Stirn → Kiefer'; if (sec<30) return 'Nacken/Schultern'; if (sec<45) return 'Brustkorb/Bauch'; return 'Beine/Füße' }
const groundingInstructionAt = (sec:number) => {
  if (sec<12) return 'Sieh dich um: 5 Dinge, die du sehen kannst.'
  if (sec<24) return 'Spüre 4 Dinge, die du fühlst.'
  if (sec<36) return 'Höre 3 Geräusche.'
  if (sec<48) return 'Rieche 2 angenehme Düfte.'
  return 'Schmecke 1 Sache – ganz bewusst.'
}
function useInstruction(exId: ExerciseId, elapsed: number){
  const [text, setText] = useState<string | null>(null)
  const lastSec = useRef(-1)
  useEffect(() => {
    const sec = Math.floor(elapsed)
    if (sec === lastSec.current) return
    lastSec.current = sec
    let t: string | null = null
    if (exId==='breath') t = breathInstructionAt(sec)
    else if (exId==='body') t = bodyInstructionAt(sec)
    else if (exId==='ground') t = groundingInstructionAt(sec)
    setText(t)
  }, [elapsed, exId])
  return text
}

// Ambience (Regen/Ozean/Wald + Noise + Wind)

type AmbienceCtrl = {
  start: (type: 'white'|'brown'|'pink'|'rain'|'ocean'|'wind'|'forest', vol: number) => Promise<void>
  stop: () => Promise<void>
  setVolume: (vol:number) => void
}


function useAmbience(): AmbienceCtrl{
  const ctxRef = useRef<AudioContext|null>(null)
  const srcRef = useRef<AudioBufferSourceNode|null>(null)
  const gainRef = useRef<GainNode|null>(null)
  const typeRef = useRef<string|undefined>(undefined)
  const loadWavBuffer = async (ctx: AudioContext, type: string): Promise<AudioBuffer|null> => {
    try{
      const res = await fetch(`/aki/ambience/${type}.wav`)
      if (!res.ok) return null
      const arr = await res.arrayBuffer()
      return await ctx.decodeAudioData(arr)
    }catch{ return null }
  }
  const synthFallback = (ctx: AudioContext, type: 'rain'|'ocean'|'wind'|'forest'|'white'|'brown'|'pink') => {
    const length = ctx.sampleRate * 3
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    const rnd = () => Math.random()*2 - 1
    let last = 0
    for (let i=0;i<length;i++){
      const w = rnd()
      if (type==='white') { data[i] = w*0.6; continue }
      if (type==='brown') { last = (last + 0.02*w)/1.02; data[i] = last * 3.5; continue }
      if (type==='pink')  { last = 0.98*last + 0.02*w; data[i] = last * 1.8; continue }
      if (type==='rain'){ data[i] = 0.3*w; continue }
      if (type==='ocean'){ last = 0.995*last + 0.005*w; data[i] = last; continue }
      if (type==='wind'){ data[i] = 0.5*w; continue }
      if (type==='forest'){ data[i] = 0.2*w; continue }
      data[i] = 0.5*w
    }
    return buffer
  }
  const fade = async (gain: GainNode, a:number, b:number, ms:number) => {
    const ctx = gain.context
    const t0 = ctx.currentTime
    gain.gain.cancelScheduledValues(t0)
    gain.gain.setValueAtTime(a, t0)
    gain.gain.linearRampToValueAtTime(b, t0 + ms/1000)
    await new Promise(r => setTimeout(r, ms))
  }
  const start = async (type: 'white'|'brown'|'pink'|'rain'|'ocean'|'wind'|'forest', vol: number) => {
    if (typeRef.current && typeRef.current === type && gainRef.current){
      gainRef.current.gain.value = Math.max(0, Math.min(1, vol)); return
    }
    await stop()
    const ctx = new (window as any).AudioContext()
    let buf = await loadWavBuffer(ctx, type); if (!buf) buf = synthFallback(ctx, type)
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
    const gain = ctx.createGain(); gain.gain.value = 0.0001
    src.connect(gain).connect(ctx.destination); src.start()
    ctxRef.current = ctx; srcRef.current = src; gainRef.current = gain; typeRef.current = type
    await fade(gain, 0.0001, Math.max(0, Math.min(1, vol)), 150)
  }
  
const stop = async () => {
  const ctx = ctxRef.current, src = srcRef.current, gain = gainRef.current
  try{
    if (gain && ctx) {
      const t0 = ctx.currentTime
      try {
        gain.gain.cancelScheduledValues(t0)
        gain.gain.setValueAtTime(gain.gain.value, t0)
        gain.gain.linearRampToValueAtTime(0.0001, t0 + 0.12)
      } catch {}
    }
    try{ if (src) src.stop(0) }catch{}
    try{ if (ctx) await ctx.close() }catch{}
  } finally {
    ctxRef.current = null; srcRef.current = null; gainRef.current = null; typeRef.current = undefined
  }
}
const setVolume = (vol:number) => { if (gainRef.current) gainRef.current.gain.value = Math.max(0, Math.min(1, vol)) }
  return { start, stop, setVolume }
}
export default function LiveDemoSection(){
  const [akiEnabled, setAkiEnabled] = useState(true)
  return (
    <section className="ld-wrap ld-wrap--spaced" aria-labelledby="live-demo-title">
      <header className="ld-head">
        <div className="ld-head-center">\n          <div className="ld-overline">Live‑Demo</div>
          <h2 id="live-demo-title" className="section-title">Aki testen — Live-Demo</h2>
          <p className="section-sub">Demo-Funktionen werden regelmäßig getauscht – so kannst du dir selbst ein Bild machen.</p>
        </div>
        <button
          type="button"
          className={"ld-aki-pill ld-aki-fab" + (akiEnabled ? " on" : "")}
          role="switch"
          aria-checked={akiEnabled}
          onClick={() => setAkiEnabled(v => !v)}
        >
          <span className="ld-aki-dot" aria-hidden="true"></span>
          Aki als Begleiter {akiEnabled ? 'aktiv' : 'deaktiviert'}
        </button>
      </header>

      <div className="ld-grid">
        {EXERCISES.map(ex => (
          <ExerciseCard key={ex.id} ex={ex} akiEnabled={akiEnabled} />
        ))}
      </div>
    </section>
  )
}

function ExerciseCard({ ex, akiEnabled }: { ex: Exercise, akiEnabled: boolean }){
  const timer = useTimer(ex.durationSec)
  const [done, setDone] = useState(false)

  const [akiIdx, setAkiIdx] = useState<number>(findCalmIndex())
  const [akiKey, setAkiKey] = useState<number>(0)
  const [akiQuote, setAkiQuote] = useState<string>('Lass uns sanft beginnen.')
  const recentQuotes = useRef<string[]>([])

  useEffect(() => {
    if (!akiEnabled || !timer.running) return
    const id = setInterval(() => {
      setAkiIdx((prev: number) => {
        const next = pickNext(prev)
        const pool = QUOTES[ex.id] || ['Weiter so.']
        let q = pool[Math.floor(Math.random()*pool.length)]
        let spins = 0
        while (recentQuotes.current.includes(q) && spins < 8) { q = pool[Math.floor(Math.random()*pool.length)]; spins++ }
        recentQuotes.current = [q, ...recentQuotes.current].slice(0,4)
        setAkiQuote(q); setAkiKey(k=>k+1); playPlopp()
        return next
      })
    }, 6000)
    return () => clearInterval(id)
  }, [akiEnabled, timer.running, ex.id])

  const instruction = useInstruction(ex.id, timer.elapsed)

  // Ambience
  const [ambType, setAmbType] = useState<'white'|'brown'|'pink'|'rain'|'ocean'|'wind'|'forest'>('rain')
  const [volume, setVolume] = useState(0.6)
  const amb = useAmbience()
  /* v27_ambience_unmount */
  /* v27_ambience_guard */
  useEffect(() => {
    // stop ambience when exercise is not running (manual stop or pause)
    if (!timer.running) { (async()=>{ try{ await amb.stop() }catch{} })() }
    // auto-finish: mark as done when reached 100%
    if (!timer.running && typeof timer?.progress === 'number' && timer.progress >= 1) { try{ setDone(true) }catch{} }
  }, [timer.running, timer.progress])
  useEffect(() => {
    return () => { (async()=>{ try{ await amb.stop() }catch{} })() }
  }, [])
  useEffect(() => { if (timer.running && ex.id==='noise') amb.setVolume(volume) }, [volume, timer.running, ex.id])

  // Auto-finish & cleanup
  useEffect(() => {
    if (!timer.running && timer.progress >= 1) setDone(true)
    if (!timer.running && ex.id==='noise') amb.stop()
  }, [timer.running, timer.progress, ex.id])

  const pct = Math.round(timer.progress * 100)
  const ringStyle: any = { background: `conic-gradient(var(--primary) ${pct*3.6}deg, rgba(255,255,255,.08) 0deg)` }
  const glowClass = (ex.id === 'breath' || ex.id === 'body' || ex.id === 'ground') && timer.running ? ' ld-ring--glow' : ''

  const label = timer.running ? 'Stopp' : (done ? 'Erneut' : 'Start')
  const onClick = async () => {
    /* v27_stop_branch */
if (timer.running) {
  try{ await amb.stop() }catch{}
  timer.reset()
  return
}
    setDone(false); timer.reset(); if (ex.id==='noise') await amb.start(ambType, volume); timer.setRunning(true)
    setAkiIdx(findCalmIndex()); setAkiQuote('Lass uns sanft beginnen.'); recentQuotes.current = []; setAkiKey(k=>k+1); playPlopp()
  }

  return (
    <article className={"ld-card glass" + (timer.running ? " running" : "")}>
      <header className="ld-card-head">
        <div className="ld-titleblock">
          <span className="ld-ico" aria-hidden="true">{ex.icon}</span>
          <h3 className="ld-card-title">{ex.title}</h3>
          {ex.subtitle && <span className="ld-chip">{ex.subtitle}</span>}
        </div>
      </header>

      <div className="ld-body">
        <p className={"ld-desc" + (timer.running ? " ld-fade" : "")}>{ex.description}</p>

        {ex.id==='noise' && (
          <div className="ld-noise">
            <label className="ld-noise__label">Ambience</label>
            <div className="segmented" role="tablist" aria-label="Ambience auswählen">
              {(['rain','ocean','forest','white','brown','pink','wind'] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  role="tab"
                  aria-selected={ambType===opt}
                  className={"segmented__item" + (ambType===opt ? " is-active" : "")}
                  onClick={()=>setAmbType(opt as any)}
                  disabled={timer.running}
                >{opt==='rain'?'Regen':opt==='ocean'?'Ozean':opt==='forest'?'Wald':opt==='white'?'White':opt==='brown'?'Brown':opt==='pink'?'Pink':'Wind'}</button>
              ))}
            </div>
            <label className="ld-noise__label">Lautstärke</label>
            <div className="ld-noise__range-wrap">
              <input
                className="ld-noise__range" type="range" min={0} max={1} step={0.01}
                value={volume}
                onChange={e=>setVolume(parseFloat(e.target.value))}
                aria-label="Lautstärke"
                aria-valuetext={`Lautstärke: ${Math.round(volume*100)} %`}
                disabled={timer.running}
              />
              <div className="ld-noise__ticks" aria-hidden="true"></div>
            </div>
          </div>
        )}
        {instruction && timer.running && (
          <div className="ld-instr ld-fade">
            <img src="/aki/icons/step.svg" alt="" role="presentation" className="ld-instr__ico" />
            <span className="ld-instr__text">{instruction}</span>
          </div>
        )}

        {akiEnabled && timer.running && (
          <div key={akiKey} className="ld-aki bubble-in">
            <img className="ld-aki__img" src={(AKI_VARIANTS as any)[akiIdx].img} alt="" role="presentation" />
            <div className="ld-aki__content">
              <p className="ld-aki__text">{akiQuote}</p>
            </div>
          </div>
        )}
      </div>

      <footer className="ld-foot">
        <div className="ld-timer">
          <div className={"ld-ring" + glowClass} style={ringStyle} aria-hidden="true">
            <div className="ld-ring__inner">
              <div className="ld-ring__num">{timer.remaining}</div>
              <div className="ld-ring__label">{timer.running ? 'läuft' : (done ? 'fertig' : 'bereit')}</div>
            </div>
          </div>
          <button className="btn-primary" onClick={onClick}>{label}</button>
        </div>
        {done && <div className="ld-done">Geschafft. Wie fühlst du dich?</div>}
      </footer>
    </article>
  )
}