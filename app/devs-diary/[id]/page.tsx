import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntryCard from '@/components/diary/EntryCard'
import SplitText from '@/components/ui/SplitText'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'

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

function loadEntries(): Entry[]{
  const file = path.join(process.cwd(), 'content/devs-diary/index.json')
  const raw = fs.readFileSync(file, 'utf8')
  const json = JSON.parse(raw)
  const arr = (json.entries||[]) as any[]
  return arr.map((e) => EntrySchema.parse(e))
}

export async function generateMetadata({ params }: any){
  const entries = loadEntries()
  const entry = entries.find(e => e.id === params.id)
  if(!entry) return {}
  const og = `/api/og?t=${encodeURIComponent(entry.title)}&s=${encodeURIComponent(entry.summary)}`
  return {
    title: `${entry.title} – Dev’s Diary`,
    description: entry.summary,
    openGraph: {
      title: entry.title,
      description: entry.summary,
      images: [{ url: og }]
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.summary,
      images: [og]
    }
  }
}

export default function EntryDetail({ params }: any){
  const entries = loadEntries()
  const entry = entries.find(e => e.id === params.id)
  if(!entry) return notFound()

  return (
    <main className="container">
      <header className="diary-header" style={{ paddingBottom: 24 }}>
        <h1>{entry.title}</h1>
        <p><SplitText text={entry.summary} /></p>
        <p className="meta" style={{ opacity:.75, marginTop:8 }}>
          {new Date(entry.date).toLocaleDateString('de-DE')} · {entry.kind.join(' · ')}
        </p>
        <p style={{ marginTop: 8 }}><Link href="/devs-diary" className="btn-ghost">← Zurück zum Diary</Link></p>
      </header>

      <section className="entry-grid">
        <div className="entry-col" style={{ gridColumn: '1 / -1' }}>
          <EntryCard entry={entry as any} />
        </div>
      </section>
    </main>
  )
}
