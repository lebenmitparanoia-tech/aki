'use client'
import React, { useEffect, useState } from 'react'

type Props = { text: string; className?: string; delayStepMs?: number }
export default function SplitText({ text, className='', delayStepMs=60 }: Props){
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = requestAnimationFrame(()=>setMounted(true)); return ()=>cancelAnimationFrame(t) }, [])
  const words = text.split(/(\s+)/) // keep spaces
  return (
    <span className={`split ${mounted ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) =>
        w.trim() === '' ? (
          <span key={i} aria-hidden="true">{w}</span>
        ) : (
          <span key={i} className="split-word" style={{ ['--d' as any]: `${i*delayStepMs}ms` }}>{w}</span>
        )
      )}
    </span>
  )
}
