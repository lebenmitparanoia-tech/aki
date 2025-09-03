# Ops-Canvas – echte Live-Metriken anbinden

## Schnellstart (ohne Copy/Paste)
1) Paket entpacken und Installer laufen lassen:
   ```bash
   unzip aki-diary-v34-ops-canvas.zip -d .
   node scripts/install-ops-canvas-v34.mjs
   ```

2) Für echte Live-Daten ENV setzen (z. B. in `.env.local`):
   ```bash
   OPS_SOURCE_URL="https://aki-mind.de/ops/stream"
   ```
   - Der Endpunkt darf **JSON** (Pull) oder **SSE** senden.
   - Erwartetes JSON/SSE-Frame:
     ```json
     {
       "ts": 1693382400000,
       "uptime90": 0.9997,
       "latency_p95_ms": 320,
       "error_rate_pct": 0.05,
       "sessions_active": 48,
       "cpu_p50": 0.30,
       "cpu_p95": 0.45,
       "mem_used_pct": 0.52
     }
     ```

3) Build starten:
   ```bash
   npm run build && npm start
   ```

## Beispiel-Backends
- **Prometheus/Victoria → Edge-Aggregator**: Aggregiere die Rohwerte und biete einen read‑only Stream unter `/ops/stream` aus.
- **FastAPI/CF Worker**: Liefere 1 Hz Frames im obigen Format als SSE.

## Datenschutz
- Nur aggregierte Zeitreihen, keine IDs/PII.
- CORS/CSP restriktiv konfigurieren, Tokens kurzlebig halten.
