'use client'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  speedMs?: number      // time per character
  startDelayMs?: number // delay before typing starts
  className?: string
  cursor?: string
}

export default function TypeText({
  text,
  speedMs = 42,
  startDelayMs = 300,
  className = '',
  cursor = '|',
}: Props){
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)
  const starter = useRef<number | null>(null)

  useEffect(() => {
    // start typing after a short delay
    starter.current = window.setTimeout(() => {
      let i = 0
      timer.current = window.setInterval(() => {
        i++
        setOut(text.slice(0, i))
        if (i >= text.length){
          if (timer.current) window.clearInterval(timer.current)
          setDone(true)
        }
      }, speedMs)
    }, startDelayMs)

    return () => {
      if (starter.current) window.clearTimeout(starter.current)
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [text, speedMs, startDelayMs])

  return (
    <span className={`type ${className}`} aria-label={text}>
      <span className="type-content">{out}</span>
      <span className={`type-cursor ${done ? 'is-done' : ''}`} aria-hidden="true">{cursor}</span>
    </span>
  )
}
