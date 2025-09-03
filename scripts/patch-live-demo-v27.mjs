#!/usr/bin/env node
// v27 (ESM) – Ambience stop on manual STOP, on auto-finish, and on unmount.
import fs from 'fs'
import path from 'path'
import process from 'process'

const proj = process.cwd()
const tsxPath = path.join(proj, 'components/sections/live-demo/LiveDemoSection.tsx')

if (!fs.existsSync(tsxPath)){ console.error('❌ Datei nicht gefunden:', tsxPath); process.exit(1) }
let src = fs.readFileSync(tsxPath, 'utf8')

// 1) Ensure on-unmount cleanup: amb.stop()
if (!/useEffect\\(\\(\\) => \\{\\s*return \\(\\) => \\{[^}]*amb\\.stop\\(\\)/.test(src)){
  // inject directly inside ExerciseCard component after amb const
  src = src.replace(
    /const amb = useAmbience\\(\\)\\s*\\n/,
    `const amb = useAmbience()\n  // Stop Ambience on unmount (safety)\n  useEffect(() => { return () => { try{ amb.stop() }catch{} } }, [])\n`
  )
}

// 2) Strengthen "when stopped -> stop sound" effect
// Replace existing effect that references timer.running and timer.progress
src = src.replace(
  /useEffect\\(\\s*\\(\\) => \\{[\\s\\S]*?\\}, \\[timer\\.running, timer\\.progress, ex\\.id\\]\\)/m,
  `useEffect(() => {
    // Always stop ambience when exercise is not running (manual stop or pause)
    if (!timer.running) { try{ amb.stop() }catch{} }
    // Auto-finish -> mark done
    if (!timer.running && timer.progress >= 1) setDone(true)
  }, [timer.running, timer.progress])`
)

// 3) Ensure STOP branch really awaits amb.stop()
src = src.replace(
  /if \\(timer\\.running\\) \\{[^}]*timer\\.reset\\(\\);[^}]*return \\}/m,
  `if (timer.running) { 
      timer.reset(); 
      try{ await amb.stop() }catch{} 
      return 
    }`
)

fs.writeFileSync(tsxPath, src, 'utf8')
console.log('✅ v27 (ESM) angewendet: Ambience stop bei Stop/Finish/Unmount.')
