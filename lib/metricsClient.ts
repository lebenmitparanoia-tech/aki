
export type Metrics = { uptime:number; p95:number; errors:number; seats:number; ts?:number }

const CACHE_KEY = 'aki.metrics.cache'

export function readCache(): Metrics | null{
  try{
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  }catch{ return null }
}

export function writeCache(m: Metrics){
  try{ localStorage.setItem(CACHE_KEY, JSON.stringify({ ...m, ts: Date.now() })) }catch{}
}

export function connect(cb:(m:Metrics)=>void, onStatus?:(s:'live'|'cached'|'error')=>void){
  const cached = readCache()
  if(cached){ onStatus?.('cached'); cb(cached) }

  let es: EventSource | null = null
  try{
    es = new EventSource('/api/metrics/stream')
    es.onmessage = (ev) => {
      const m = JSON.parse(ev.data)
      const result = { uptime: m.uptime, p95: m.p95, errors: m.errors, seats: m.seats, ts: Date.now() }
      writeCache(result)
      cb(result)
      onStatus?.('live')
    }
    es.onerror = () => {
      onStatus?.('error')
      es?.close()
    }
  }catch{
    onStatus?.('error')
  }

  return () => es?.close()
}

export function timeAgo(ms?:number){
  if(!ms) return ''
  const sec = Math.floor((Date.now()-ms)/1000)
  if(sec < 60) return `vor ${sec}s`
  const min = Math.floor(sec/60)
  if(min < 60) return `vor ${min} min`
  const h = Math.floor(min/60)
  return `vor ${h} Std.`
}
