'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function TopNav(){
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={"topnav" + (scrolled ? " is-scrolled" : "")}>
      <nav className="nav" aria-label="Hauptnavigation">
        <Link className="logo" href="/">Aki</Link>
        <div className="nav-links">
          <Link href="#demo">Demo</Link>
          <Link href="#roadmap">Roadmap</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="/unterstuetzen">Unterstützen</Link>
        </div>
      </nav>
    </div>
  )
}
