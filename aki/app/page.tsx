import AboutAki from '@/components/sections/AboutAki'
import Roadmap from '@/components/sections/Roadmap'
import SplitText from '@/components/ui/SplitText'
import TypeText from '@/components/ui/TypeText'

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
        <div className="hero-ctas">
          <a className="btn-primary" href="#about">Erfahre mehr</a>
          <a className="btn-ghost" href="#roadmap">Roadmap</a>
        </div>
      </header>

      <AboutAki />

      <Roadmap />
    </main>
  )
}
