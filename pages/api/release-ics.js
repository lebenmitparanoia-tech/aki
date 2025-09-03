
export default function handler(req, res) {
  const { title = 'Aki v1.0', date } = req.query
  const d = date ? new Date(date) : new Date('2026-08-01T00:00:00+02:00')
  if (isNaN(d.getTime())) return res.status(400).json({ error: 'invalid_date' })
  const fmt = (x)=> x.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//aki-mind.de//Aki//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@aki-mind.de`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(d)}`,
    `DTEND:${fmt(new Date(d.getTime()+60*60*1000))}`,
    `SUMMARY:${title}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\\r\\n')
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="aki-release.ics"')
  res.status(200).send(ics)
}
