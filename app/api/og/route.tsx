export const runtime = 'edge'
import { ImageResponse } from 'next/og'

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const t = searchParams.get('t') || 'Dev’s Diary'
  const s = searchParams.get('s') || 'Einblicke ohne Druck'

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630, display: 'flex', flexDirection:'column',
          justifyContent:'center', alignItems:'center',
          background: 'radial-gradient(800px 400px at 30% 20%, #0a2a33, #071a20 60%, #06161a)',
          color: '#eaffff', fontSize: 64, fontWeight: 800, letterSpacing: '-0.02em'
        }}
      >
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(300px 120px at 70% 75%, rgba(76,180,255,.35), transparent 60%)', filter:'blur(40px)' }} />
        <div style={{ padding: '0 80px', textAlign:'center' }}>{t}</div>
        <div style={{ marginTop: 16, fontSize: 28, fontWeight: 500, opacity:.9 }}>{s}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
