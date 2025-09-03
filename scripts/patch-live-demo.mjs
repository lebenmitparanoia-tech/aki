import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()

function stripTryAki(s){
  return s.replace(/^[^\n]*TryAki[^\n]*\n/gm,'')
          .replace(/<TryAki[^>]*\/>/g,'')
          .replace(/<TryAki[^>]*>[\s\S]*?<\/TryAki>/g,'')
}
function ensureImports(s){
  if (!/LiveDemoSection/.test(s))
    s = "import LiveDemoSection from '@/components/sections/live-demo/LiveDemoSection'\n"
      + "import '@/components/sections/live-demo/live-demo.css'\n" + s
  else if (!/live-demo\.css/.test(s))
    s = "import '@/components/sections/live-demo/live-demo.css'\n" + s
  return s
}
function injectSection(s){
  s = s.replace(/<LiveDemoSection\s*\/>/g,'')
  return s.includes('</main>') ? s.replace('</main>', '  <LiveDemoSection />\n</main>') : (s+"\n<LiveDemoSection />\n")
}
function patchFile(file){
  if (!fs.existsSync(file)) return
  const src = fs.readFileSync(file,'utf8')
  let out = stripTryAki(src)
  out = ensureImports(out)
  out = injectSection(out)
  if (out!==src){ fs.writeFileSync(file+'.bak', src); fs.writeFileSync(file, out); console.log('Patched', path.relative(root,file)) }
}
;['app/page.tsx','app/page.jsx','pages/index.tsx','pages/index.jsx'].forEach(p=>patchFile(path.join(root,p)))
;['app/layout.tsx','app/layout.jsx'].forEach(f=>{ if (fs.existsSync(f)){ const s=fs.readFileSync(f,'utf8'); const o=stripTryAki(s); if (o!==s){ fs.writeFileSync(f+'.bak',s); fs.writeFileSync(f,o); console.log('Cleaned', f) } } })
console.log('Done')
