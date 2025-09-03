#!/usr/bin/env node
// v27.1 (ESM): Ambience stop on manual STOP, on auto-finish, and on unmount.
// Safer: additive effects with clear markers; no complex regex groups.
import fs from 'fs'
import path from 'path'
import process from 'process'

const proj = process.cwd()
const tsxPath = path.join(proj, 'components/sections/live-demo/LiveDemoSection.tsx')

if (!fs.existsSync(tsxPath)){ console.error('❌ Datei nicht gefunden:', tsxPath); process.exit(1) }
let src = fs.readFileSync(tsxPath, 'utf8')

const ambAnchor = 'const amb = useAmbience()'
if (!src.includes(ambAnchor)){
  console.error('❌ Anker nicht gefunden: "'+ambAnchor+'". Bitte Datei prüfen.')
  process.exit(1)
}

// 1) On-unmount cleanup (idempotent)
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

// 2) Guard effect to stop ambience whenever exercise not running, and mark done when finished.
if (!src.includes('/* v27_ambience_guard */')){
  const injectAfter = '/* v27_ambience_unmount */'
  const guard = `
  /* v27_ambience_guard */
  useEffect(() => {
    // stop ambience when exercise is not running (manual stop or pause)
    if (typeof amb?.stop === 'function' && !timer.running) { try{ amb.stop() }catch{} }
    // auto-finish: mark as done when reached 100%
    if (!timer.running && typeof timer?.progress === 'number' && timer.progress >= 1) { try{ setDone(true) }catch{} }
  }, [timer.running, timer.progress])`
  if (src.includes(injectAfter)){
    src = src.replace(injectAfter, injectAfter + guard)
  } else {
    // fallback: append near after ambAnchor
    src = src.replace(ambAnchor, ambAnchor + guard)
  }
}

// 3) Optional: make STOP onClick non-awaited but explicit (best-effort). We try a gentle replacement.
if (!src.includes('/* v27_stop_branch */')){
  src = src.replace(
    /if\s*\(\s*timer\.running\s*\)\s*\{\s*([\s\S]*?)timer\.reset\(\);\s*([\s\S]*?)return\s*\}/,
    (m)=>{
      return `/* v27_stop_branch */\nif (timer.running) {\n  try{ amb.stop() }catch{}\n  timer.reset()\n  return\n}`
    }
  )
}

fs.writeFileSync(tsxPath, src, 'utf8')
console.log('✅ v27.1 (ESM) angewendet: Ambience stop bei Stop/Finish/Unmount (additive).')
