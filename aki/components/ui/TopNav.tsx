'use client'
import Link from 'next/link'

export default function TopNav(){
  return (
    <div className="topnav">
      <nav className="nav" aria-label="Hauptnavigation">
        <Link className="logo" href="/">Aki</Link>
        <div className="nav-links">
          <Link href="#about">Über Aki</Link>
          <Link href="#support">Unterstützen</Link>
        </div>
      </nav>
    </div>
  )
}
