#!/usr/bin/env node
// v27 (CJS) – Ambience stop on manual STOP, on auto-finish, and on unmount.
const fs = require('fs')
const path = require('path')
const process = require('process')

const proj = process.cwd()
const tsxPath = path.join(proj, 'components/sections/live-demo/LiveDemoSection.tsx')

if (!fs.existsSync(tsxPath)){ console.error('❌ Datei nicht gefunden:', tsxPath); process.exit(1) }
let src = fs.readFileSync(tsxPath, 'utf8')

if (!/useEffect\\(\\(\\) => \\{\\s*return \\(\\) => \\{[^}]*amb\\.stop\\(\\)/.test(src)){
  src = src.replace(
    /const amb = useAmbience\\(\\)\\s*\\n/,
    `const amb = useAmbience()\n  // Stop Ambience on unmount (safety)\n  useEffect(() => { return () => { try{ amb.stop() }catch{} } }, [])\n`
  )
}

src = src.replace(
  /useEffect\\(\\s*\\(\\) => \\{[\\s\\S]*?\\}, \\[timer\\.running, timer\\.progress, ex\\.id\\]\\)/m,
  `useEffect(() => {
    if (!timer.running) { try{ amb.stop() }catch{} }
    if (!timer.running && timer.progress >= 1) setDone(true)
  }, [timer.running, timer.progress])`
)

src = src.replace(
  /if \\(timer\\.running\\) \\{[^}]*timer\\.reset\\(\\);[^}]*return \\}/m,
  `if (timer.running) { 
      timer.reset(); 
      try{ await amb.stop() }catch{} 
      return 
    }`
)

fs.writeFileSync(tsxPath, src, 'utf8')
console.log('✅ v27 (CJS) angewendet: Ambience stop bei Stop/Finish/Unmount.')
