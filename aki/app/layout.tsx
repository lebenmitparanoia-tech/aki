import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import IridescenceOGL from '@/components/FX/IridescenceOGL'
import TopNav from '@/components/ui/TopNav'

export const metadata: Metadata = {
  title: 'Aki – Ruhige Tools für schwierige Tage',
  description:
    'Eine ruhige, deutschsprachige Web-App für Menschen mit paranoiden Gedanken – und für Angehörige.',
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.variable}>
        {/* OGL-Hintergrund (Iridescence, Teal/Blau) */}
        <IridescenceOGL />

        {/* Navigation */}
        <TopNav />

        {/* Seite */}
        {children}
      </body>
    </html>
  )
}
