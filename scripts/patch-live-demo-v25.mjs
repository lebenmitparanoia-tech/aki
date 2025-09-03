#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import process from 'process'

const proj = process.cwd()
const tsxPath = path.join(proj, 'components/sections/live-demo/LiveDemoSection.tsx')
const cssPath = path.join(proj, 'components/sections/live-demo/live-demo.css')
const ambDir  = path.join(proj, 'public/aki/ambience')

const read = p => fs.readFileSync(p, 'utf8')
const write = (p, s) => fs.writeFileSync(p, s, 'utf8')
const ensureDir = p => fs.mkdirSync(p, { recursive:true })

if(!fs.existsSync(tsxPath) || !fs.existsSync(cssPath)) { console.error('❌ Dateien nicht gefunden.'); process.exit(1) }

let src = read(tsxPath)
const start = src.indexOf('function useAmbience(){')
const end   = src.indexOf('export default function LiveDemoSection()', start)
if(start === -1 || end === -1){ console.error('❌ useAmbience()-Block nicht gefunden.'); process.exit(1) }

const newUse = `function useAmbience(){
  const ctxRef = useRef<AudioContext|null>(null)
  const srcRef = useRef<AudioBufferSourceNode|null>(null)
  const gainRef = useRef<GainNode|null>(null)
  const typeRef = useRef<string|undefined>(undefined)
  const loadWavBuffer = async (ctx: AudioContext, type: string): Promise<AudioBuffer|null> => {
    try{
      const res = await fetch(\`/aki/ambience/\${type}.wav\`)
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
    try{ if (gain) { await (async () => { await fade(gain, gain.gain.value, 0.0001, 160) })() } if (src) src.stop(); if (ctx) await ctx.close() }catch{}
    ctxRef.current = null; srcRef.current = null; gainRef.current = null; typeRef.current = undefined
  }
  const setVolume = (vol:number) => { if (gainRef.current) gainRef.current.gain.value = Math.max(0, Math.min(1, vol)) }
  return { start, stop, setVolume }
}
`
src = src.slice(0, start) + newUse + src.slice(end)
src = src.replace('className={"ld-aki-pill" + (akiEnabled ? " on" : "")}', 'className={"ld-aki-pill ld-aki-fab" + (akiEnabled ? " on" : "")}')
write(tsxPath, src)

let css = read(cssPath)
css = css.replace(/\.ld-wrap\{([^}]*)\}/, (m,g1)=>`.ld-wrap{ position:relative; ${g1.trim()} }`)
if (/\.ld-aki-fab\{[^}]*\}/.test(css)){ css = css.replace(/\.ld-aki-fab\{[^}]*\}/, '.ld-aki-fab{ position:absolute; right:12px; bottom:-18px; transform: translateY(50%); z-index:2 }') }
else { css += '\n.ld-aki-fab{ position:absolute; right:12px; bottom:-18px; transform: translateY(50%); z-index:2 }\n' }
if (!/@media \(max-width: 720px\)\{[\s\S]*\.ld-aki-fab/.test(css)){ css += '\n@media (max-width: 720px){\n  .ld-aki-fab{ position: fixed; right: 14px; bottom: 14px; transform:none; z-index: 5 }\n}\n' }
write(cssPath, css)

fs.mkdirSync(ambDir, { recursive:true })
fs.writeFileSync(path.join(ambDir,'README.txt'),
'Lege echte Natur-Sounds hier ab (werden automatisch genutzt):\n- rain.wav\n- ocean.wav\n- wind.wav\n- forest.wav\n')

console.log('✅ Patch v25.1 angewendet (ESM minimal).')
