import AboutAki from '@/components/sections/AboutAki'
import Roadmap from '@/components/sections/Roadmap'
import LiveDemoSection from '@/components/sections/live-demo/LiveDemoSection'
import SplitText from '@/components/ui/SplitText'
import TypeText from '@/components/ui/TypeText'
import '@/components/sections/live-demo/live-demo.css'

export default function Page(){
  return (
    <main className="container">
      <header className="hero">
        <h1 className="hero-title">
          <TypeText text="Aki – ruhige Tools für schwierige Tage" />
        </h1>
        <p className="hero-sub">
          <SplitText text="Struktur ohne Druck. Hilfe, wenn du sie brauchst." />
        </p>
        <div className="hero-ctas btn-row">
          <a className="btn btn-primary" href="#demo">Demo testen</a>
          <a className="btn btn-secondary" href="#wer-ist-aki">Über Aki</a>
        </div>
        <div className="hero-trust">Datensparsam · kein Tracking · DSGVO-konform</div>
      </header>

      <AboutAki />
      <section id="faq" className="spaced" aria-label="FAQ"></section>
      <Roadmap />
      <section id="demo"><LiveDemoSection /></section>
    </main>
  )
}
