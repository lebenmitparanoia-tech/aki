#!/usr/bin/env node
// v27.1 (CJS): gleiches Verhalten wie ESM
const fs = require('fs')
const path = require('path')
const process = require('process')

const proj = process.cwd()
const tsxPath = path.join(proj, 'components/sections/live-demo/LiveDemoSection.tsx')

if (!fs.existsSync(tsxPath)){ console.error('❌ Datei nicht gefunden:', tsxPath); process.exit(1) }
let src = fs.readFileSync(tsxPath, 'utf8')

const ambAnchor = 'const amb = useAmbience()'
if (!src.includes(ambAnchor)){
  console.error('❌ Anker nicht gefunden: \"'+ambAnchor+'\". Bitte Datei prüfen.')
  process.exit(1)
}

if (!src.includes('/* v27_ambience_unmount */')){
  src = src.replace(
    ambAnchor,
    ambAnchor + `
  /* v27_ambience_unmount */
  useEffect(() => {
    return () => { try{ amb.stop() }catch{} }
  }, [])`
  )
}

if (!src.includes('/* v27_ambience_guard */')){
  const injectAfter = '/* v27_ambience_unmount */'
  const guard = `
  /* v27_ambience_guard */
  useEffect(() => {
    if (typeof amb?.stop === 'function' && !timer.running) { try{ amb.stop() }catch{} }
    if (!timer.running && typeof timer?.progress === 'number' && timer.progress >= 1) { try{ setDone(true) }catch{} }
  }, [timer.running, timer.progress])`
  if (src.includes(injectAfter)){
    src = src.replace(injectAfter, injectAfter + guard)
  } else {
    src = src.replace(ambAnchor, ambAnchor + guard)
  }
}

if (!src.includes('/* v27_stop_branch */')){
  src = src.replace(
    /if\s*\(\s*timer\.running\s*\)\s*\{\s*([\s\S]*?)timer\.reset\(\);\s*([\s\S]*?)return\s*\}/,
    (m)=>{
      return `/* v27_stop_branch */\nif (timer.running) {\n  try{ amb.stop() }catch{}\n  timer.reset()\n  return\n}`
    }
  )
}

fs.writeFileSync(tsxPath, src, 'utf8')
console.log('✅ v27.1 (CJS) angewendet: Ambience stop bei Stop/Finish/Unmount (additive).')
