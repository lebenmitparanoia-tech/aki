
// scripts/fix-ops-import-v35.mjs
import fs from 'fs';
import path from 'path';
import url from 'url';

const cwd = process.cwd();

/** Recursively find a filename under a directory. */
function findFile(dir, filename) {
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch {}
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && e.name === filename) return p;
    }
  }
  return null;
}

/** Convert absolute path to "@/..." import path */
function toAtAlias(absPath) {
  const rel = path.relative(cwd, absPath).replace(/\\/g,'/');
  return '@/' + rel.replace(/\.(t|j)sx?$/,'');
}

/** Ensure import is present in app/page.tsx */
function ensureImport(appPagePath, importPath) {
  let src = fs.readFileSync(appPagePath, 'utf8');

  if (src.includes("import OpsCanvas")) {
    console.log("✔ import OpsCanvas bereits vorhanden.");
    return;
  }

  // insert after last import line
  const lines = src.split('\n');
  let lastImport = -1;
  for (let i=0;i<lines.length;i++) {
    if (/^\s*import\s+/.test(lines[i])) lastImport = i;
  }
  const imp = `import OpsCanvas from '${importPath}'`;
  if (lastImport >= 0) {
    lines.splice(lastImport+1, 0, imp);
  } else {
    lines.unshift(imp);
  }
  const out = lines.join('\n');
  fs.writeFileSync(appPagePath, out, 'utf8');
  console.log(`✅ Import eingefügt: ${imp}`);
}

function main(){
  // 1) Locate OpsCanvas.tsx
  const candidates = [
    path.join(cwd, 'components/sections/diary/OpsCanvas.tsx'),
    path.join(cwd, 'components/diary/OpsCanvas.tsx')
  ];
  let opsPathAbs = candidates.find(p => fs.existsSync(p));
  if (!opsPathAbs) {
    const found = findFile(path.join(cwd, 'components'), 'OpsCanvas.tsx');
    if (found) opsPathAbs = found;
  }
  if (!opsPathAbs) {
    console.error('❌ OpsCanvas.tsx nicht gefunden unter ./components/**');
    process.exit(1);
  }
  const importPath = toAtAlias(opsPathAbs);

  // 2) Ensure app/page.tsx exists
  const appPage = path.join(cwd, 'app/page.tsx');
  if (!fs.existsSync(appPage)) {
    console.error('❌ app/page.tsx nicht gefunden.');
    process.exit(1);
  }

  // 3) Add import
  ensureImport(appPage, importPath);

  // 4) Quick sanity: ensure default export in OpsCanvas
  const opsSrc = fs.readFileSync(opsPathAbs, 'utf8');
  if (!/export\s+default\s+function\s+OpsCanvas/.test(opsSrc) && !/export\s+default\s+OpsCanvas/.test(opsSrc)) {
    // try to wrap with a default export if named export exists
    if (/function\s+OpsCanvas\s*\(/.test(opsSrc)) {
      const patched = opsSrc + '\nexport default OpsCanvas\n';
      fs.writeFileSync(opsPathAbs, patched, 'utf8');
      console.log('✅ Default-Export für OpsCanvas ergänzt.');
    } else {
      console.warn('⚠️ Konnte Default-Export nicht validieren – bitte prüfen:' , opsPathAbs);
    }
  } else {
    console.log('✔ OpsCanvas Default-Export vorhanden.');
  }

  console.log('🎯 Fix abgeschlossen. Jetzt: npm run build');
}

main();
