
import SplitText from '@/components/ui/SplitText'
import EntryCard from '@/components/diary/EntryCard'
import DiaryFilters from '@/components/diary/DiaryFilters'
import ModeToggles from '@/components/diary/ModeToggles'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-static'

const EntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  kind: z.array(z.string()).default([]),
  summary: z.string(),
  story: z.string(),
  learned: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  metrics: z.object({ uptime: z.number(), p95: z.number(), errors: z.number() }).optional()
})
type Entry = z.infer<typeof EntrySchema>

async function loadEntries(): Promise<Entry[]>{
  const file = path.join(process.cwd(), 'content/devs-diary/index.json')
  const raw = fs.readFileSync(file, 'utf8')
  const json = JSON.parse(raw)
  const arr = (json.entries||[]) as any[]
  return arr.map((e) => EntrySchema.parse(e)).sort((a,b) => a.date < b.date ? 1 : -1)
}

export default async function DevsDiaryPage({ searchParams }: any){
  let entries = await loadEntries()
  const _sp: any = (searchParams && typeof (searchParams as any).then === 'function') ? await (searchParams as any) : (searchParams || {})
  const kind = (_sp?.kind||'') as string
  const q = ((_sp?.q||'') as string).toLowerCase().trim()
  if(kind){ entries = entries.filter(e => e.kind?.includes(kind)) }
  if(q){ entries = entries.filter(e => (e.title+e.summary+e.story+e.tags.join(' ')).toLowerCase().includes(q)) }

  return (
    <main className="container">
      <header className="diary-header">
        <h1>Dev’s Diary</h1>
        <p><SplitText text="Einblicke ohne Druck" /></p>
      </header>

      <DiaryFilters />
      {/* toolbar moved to client component */}
      <section className="diary-toolbar" aria-label="Filter und Suche" hidden>
        <div className="diary-chips" role="group" aria-label="Filter">
          <a className="chip" href="?kind=Story">Story</a>
          <a className="chip" href="?kind=Changelog">Changelog</a>
          <a className="chip" href="?kind=Deep-Dive">Deep‑Dive</a>
          <a className="chip" href="/devs-diary">Alle</a>
        </div>
        <ModeToggles />
        <form className="search" action="/devs-diary" method="get" role="search">
          <input type="search" name="q" placeholder="Suche…" aria-label="Diary durchsuchen" />
        </form>
      </section>

      {Object.entries(entries.reduce((acc:any, e:any) => { const k = e.date.slice(0,7); (acc[k] ||= []).push(e); return acc }, {})).map(([month, list]:any) => (
        <section key={month} className="entry-grid" id={month} aria-label={`Einträge ${month}`}>
          <div className="entry-col" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ margin:'6px 0 8px', fontSize:16, opacity:.9 }}>{new Date(month+'-01').toLocaleDateString('de-DE', { year:'numeric', month:'long' })}</h2>
          </div>
          {list.map((e:any) => (
            <div key={e.id} className="entry-col">
              <EntryCard entry={e} />
            </div>
          ))}
        </section>
      ))}

    </main>
  )
}
