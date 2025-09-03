export const runtime = 'nodejs'

function toSSE(data: any){
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function GET(req: Request){
  const encoder = new TextEncoder()

  let closed = false
  let interval: NodeJS.Timeout | null = null
  let keepalive: NodeJS.Timeout | null = null

  const stream = new ReadableStream({
    start(controller){
      const safeEnqueue = (chunk: string) => {
        if (closed) return
        try{ controller.enqueue(encoder.encode(chunk)) }
        catch { /* stream likely closed */ close() }
      }

      // Initial hello
      safeEnqueue("event: ping\n" + toSSE({ hello: true }))

      let uptime = 99.98
      let p95 = 280
      let errors = 0.03
      let seats = 48

      interval = setInterval(() => {
        if (closed) return
        // gently wander numbers
        const jitter = (v:number, delta:number) => {
          const d = (Math.random()*2-1) * delta
          return Math.max(0, v + d)
        }
        uptime = Math.min(99.999, jitter(uptime, 0.002))
        p95 = Math.max(120, jitter(p95, 6))
        errors = Math.max(0, jitter(errors, 0.01))

        safeEnqueue(toSSE({
          uptime: Number(uptime.toFixed(3)),
          p95: Math.round(p95),
          errors: Number(errors.toFixed(3)),
          seats
        }))
      }, 1000)

      keepalive = setInterval(() => {
        safeEnqueue(":keepalive\n\n")
      }, 15000)

      const close = () => {
        if (closed) return
        closed = true
        if (interval) clearInterval(interval)
        if (keepalive) clearInterval(keepalive)
        try{ controller.close() }catch{}
      }

      // Schließe sauber bei Client-Abbruch
      try { req.signal.addEventListener('abort', close) } catch {}

    },
    cancel(){
      closed = true
      if (interval) clearInterval(interval)
      if (keepalive) clearInterval(keepalive)
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    }
  })
}