# Patch: Gauge-Canvas Null-Guards (v2)

Behebt den TS-Fehler in `OpsCanvas.tsx` innerhalb der `Gauge`-Komponente
(`'c' is possibly 'null'`), indem `c`/`ctx` sauber typisiert und in `draw()`
sowie bei `c.width/height/style` bewacht werden.

## Anwendung

```bash
unzip aki-fix-ops-gauge-null-guard-v2.zip -d .
node scripts/fix-ops-gauge-null-guard-v2.mjs
npm run build
```
