
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = JSON.parse(fs.readFileSync(path.join(root, 'content/devs-diary/index.json'), 'utf8'))
const entries = (src.entries||[]).map(e => ({
  id: e.id,
  title: e.title,
  date: e.date,
  summary: e.summary
}))

// JSON Feed
const feed = { version: 'https://jsonfeed.org/version/1', title: 'Aki – Dev’s Diary', home_page_url: 'https://aki-mind.de/devs-diary', items: entries.map(e => ({ id:e.id, title:e.title, date_published:e.date, summary:e.summary })) }
const outDir = path.join(root, 'public/devs-diary')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'feed.json'), JSON.stringify(feed, null, 2))

// Minimal RSS 2.0
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Aki – Dev’s Diary</title>
  <link>https://aki-mind.de/devs-diary</link>
  <description>Einblicke ohne Druck</description>
  ${entries.map(e => `<item><title>${escapeXml(e.title)}</title><link>https://aki-mind.de/devs-diary#${e.id}</link><pubDate>${new Date(e.date).toUTCString()}</pubDate><description>${escapeXml(e.summary)}</description></item>`).join('\n')}
</channel>
</rss>`

function escapeXml(s){ return String(s).replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c])) }

fs.writeFileSync(path.join(outDir, 'rss.xml'), rss)
console.log('Feeds generated to public/devs-diary/')
