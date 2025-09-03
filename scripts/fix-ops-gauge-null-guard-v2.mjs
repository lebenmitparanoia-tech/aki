
// scripts/fix-ops-gauge-null-guard-v2.mjs
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

function patchGauge(file){
  let src = fs.readFileSync(file,'utf8');
  let changed = false;

  // 1) In Gauge(), ensure ref type is explicit
  src = src.replace(
    /const\s+ref\s*=\s*useRef<[^>]*>\(\s*null\s*\)\s*;/,
    (m)=>{ changed=true; return "const ref=useRef<HTMLCanvasElement|null>(null);"; }
  );

  // 2) In useEffect of Gauge, make c/ctx nullable and guarded
  // Replace: const c=ref.current; if(!c) return; const ctx=c.getContext('2d'); if(!ctx) return;
  src = src.replace(
    /const\s+c\s*=\s*ref\.current\s*;?\s*if\(!c\)\s*return;\s*const\s+ctx\s*=\s*c\.getContext\('2d'\)\s*;?\s*if\(!ctx\)\s*return;/s,
    (m)=>{ changed=true; return "const c=ref.current as HTMLCanvasElement | null; const ctx = c?.getContext('2d') as CanvasRenderingContext2D | null; if(!c || !ctx) return;"; }
  );

  // 3) Guard inside draw(): add early return and guard assignments to c.width/height
  // Add guard at start of draw()
  src = src.replace(/function\s+draw\(\)\s*\{/, (m)=>{ changed=true; return m + "\n      if (!c || !ctx) return;"; });

  // Guard the line where width/height/style is set
  src = src.replace(
    /const\s*w\s*=\s*96\s*,\s*h\s*=\s*96\s*;\s*c\.width\s*=\s*w\*dpr;\s*c\.height\s*=\s*h\*dpr;\s*c\.style\.width\s*=\s*w\+'\px';\s*c\.style\.height\s*=\s*h\+'\px';/,
    (m)=>{ changed=true; return "const w=96,h=96; if(!c) return; c.width=w*dpr; c.height=h*dpr; (c as HTMLCanvasElement).style.width=w+'px'; (c as HTMLCanvasElement).style.height=h+'px';"; }
  );

  if(changed){
    fs.writeFileSync(file, src, 'utf8');
    console.log('✅ Gauge-Null-Guards ergänzt:', file);
  }else{
    console.log('ℹ️ Keine Änderungen nötig:', file);
  }
}

function main(){
  const cwd = process.cwd();
  const f = findFile(path.join(cwd,'components'), 'OpsCanvas.tsx');
  if(!f){ console.error('❌ OpsCanvas.tsx nicht gefunden.'); process.exit(1); }
  patchGauge(f);
  console.log('🎯 Patch abgeschlossen. Jetzt: npm run build');
}

main();
