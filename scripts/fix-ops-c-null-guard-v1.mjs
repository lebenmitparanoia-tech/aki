
// scripts/fix-ops-c-null-guard-v1.mjs
import fs from 'fs';
import path from 'path';

function findFile(dir, name){
  const stack=[dir];
  while(stack.length){
    const d=stack.pop();
    let ents=[];
    try{ ents=fs.readdirSync(d,{withFileTypes:true}); }catch{}
    for(const e of ents){
      const p=path.join(d,e.name);
      if(e.isDirectory()) stack.push(p);
      else if(e.isFile() && e.name===name) return p;
    }
  }
  return null;
}

function patchOpsCanvas(p){
  let src=fs.readFileSync(p,'utf8');
  let changed=false;

  // 1) Ensure c/ctx types are nullable-safe near first canvas ref usage
  src = src.replace(
    /const\s+c\s*=\s*([a-zA-Z_$][\w$]*?)\.current\s*;?/,
    (m, ref)=>{ changed=true; return `const c = ${ref}.current as HTMLCanvasElement | null;`; }
  );

  // Ensure ctx retrieval with optional chaining and nullable type
  src = src.replace(
    /const\s+ctx\s*=\s*c\.getContext\(['"]2d['"]\)\s*;?/,
    (m)=>{ changed=true; return `const ctx = c?.getContext('2d') as CanvasRenderingContext2D | null;`; }
  );

  // 2) Insert guards at start of repaint/resize functions
  src = src.replace(/function\s+repaint\s*\(\)\s*\{/, (m)=>{ changed=true; return m + `\n      if (!c || !ctx) return;`; });
  src = src.replace(/function\s+resize\s*\(\)\s*\{/, (m)=>{ changed=true; return m + `\n      if (!c || !ctx) return;`; });

  // 3) Guard patterns that access c directly (clientWidth/getBoundingClientRect)
  src = src.replace(/const\s+w\s*=\s*c\.clientWidth,\s*h\s*=\s*c\.clientHeight\s*;/, (m)=>{ changed=true; return `if (!c) return; const w = c.clientWidth, h = c.clientHeight;`; });
  src = src.replace(/const\s+rect\s*=\s*c\.getBoundingClientRect\(\)\s*;/, (m)=>{ changed=true; return `if (!c) return; const rect = c.getBoundingClientRect();`; });

  if(changed){
    fs.writeFileSync(p, src, 'utf8');
    console.log(`✅ Gepatcht: ${p}`);
  }else{
    console.log(`ℹ️ Keine Änderungen notwendig: ${p}`);
  }
}

function main(){
  const cwd=process.cwd();
  const file = findFile(path.join(cwd,'components'), 'OpsCanvas.tsx');
  if(!file){ console.error('❌ OpsCanvas.tsx nicht gefunden unter ./components'); process.exit(1); }
  patchOpsCanvas(file);
  console.log('🎯 Null-Guards eingefügt. Jetzt: npm run build');
}

main();
