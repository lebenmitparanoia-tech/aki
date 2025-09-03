import fs from 'node:fs'
import path from 'node:path'
const root = process.cwd()
const hits = []
function walk(dir){ for (const entry of fs.readdirSync(dir, { withFileTypes:true })){ if (entry.name==='node_modules'||entry.name==='.next') continue; const p=path.join(dir, entry.name); if (entry.isDirectory()) walk(p); else if (/\.(tsx?|jsx?)$/.test(entry.name)){ const t=fs.readFileSync(p,'utf8'); if (/TryAki/.test(t)) hits.push(p) } } }
walk(root)
console.log(hits.length? 'TryAki gefunden in:\n - '+hits.map(h=>path.relative(root,h)).join('\n - ') : 'Keine TryAki-Spuren gefunden.')