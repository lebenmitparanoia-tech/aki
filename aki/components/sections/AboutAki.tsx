import Icon from '@/components/ui/Icon'

export default function AboutAki(){
  return (
    <section id="about" className="about spaced">
      <div className="container">
        <h2 className="section-title section-title--anim">Wer ist Aki?</h2>
        <p className="section-sub">Kurz &amp; klar: Wer Aki ist – und wie er im Alltag unterstützt.</p>

        <div className="about-grid about-grid--two-rows">
          {/* 1: Wer ist Aki? (full width, Electric Border) */}
          <article className="about-card card glass electric-border">
            <header className="card-head">
              <span className="icon-badge"><Icon name="info" size={18} /></span>
              <h3 className="card-title">Wer ist Aki?</h3>
            </header>
            <p className="card-text">
              Aki ist ein optionaler, digitaler Begleiter innerhalb der Web‑App <strong>Leben mit Paranoia</strong>. Er wurde bewusst so gestaltet, dass er ruhig, einfühlsam und nicht überfordernd wirkt. Aki ist kein medizinischer Ratgeber und ersetzt keine professionelle Therapie – vielmehr ist er eine Art freundliche Stimme im Hintergrund, die Orientierung gibt, Routinen strukturiert und Sicherheit vermittelt.
            </p>
          </article>

          {/* Row 1 */}
          <article className="about-card card glass">
            <header className="card-head">
              <span className="icon-badge"><Icon name="notebook" size={18} /></span>
              <h3 className="card-title">Die Rolle von Aki</h3>
            </header>
            <ul className="q-list">
              <li>Er hilft, Funktionen der App leicht verständlich zu erklären – ohne Fachjargon oder komplexe Menüs.</li>
              <li>Er gibt sanfte Erinnerungen an Routinen wie Tagebuch‑Einträge, Skills oder Medikamente – ohne Druck.</li>
              <li>Er verweist in Krisensituationen nicht auf Eigenlösungen, sondern zeigt klar, wo professionelle Hilfe erreichbar ist.</li>
              <li>Er kann – je nach Wunsch – fast unsichtbar im Hintergrund bleiben oder aktiver Tipps geben.</li>
            </ul>
          </article>

          <article className="about-card card glass">
            <header className="card-head">
              <span className="icon-badge"><Icon name="bell" size={18} /></span>
              <h3 className="card-title">Warum Aki?</h3>
            </header>
            <ul className="q-list">
              <li><strong>Ruhig &amp; deutschsprachig:</strong> keine hektischen Animationen, kein Übermaß an Push‑Nachrichten.</li>
              <li><strong>Vertrauenswürdig:</strong> keine sensiblen Abfragen, keine versteckten Datensammlungen; respektiert Freigaben.</li>
              <li><strong>Individuell anpassbar:</strong> Nutzer:innen entscheiden selbst, wie viel Unterstützung sie möchten – von minimalen Hinweisen bis regelmäßiger Begleitung.</li>
            </ul>
          </article>

          {/* Row 2 */}
          <article className="about-card card glass">
            <header className="card-head">
              <span className="icon-badge"><Icon name="shield" size={18} /></span>
              <h3 className="card-title">Datenschutz &amp; Kontrolle</h3>
            </header>
            <ul className="q-list">
              <li><strong>Datensparsamkeit:</strong> nur das, was unbedingt notwendig ist.</li>
              <li><strong>Transparenz:</strong> jede Aktion nachvollziehbar.</li>
              <li><strong>Kontrolle:</strong> Nutzer:innen behalten jederzeit die Hoheit über ihre Daten – inkl. Verbindung zu Angehörigen.</li>
            </ul>
          </article>

          <article className="about-card card glass">
            <header className="card-head">
              <span className="icon-badge"><Icon name="users" size={18} /></span>
              <h3 className="card-title">Aki im Kontext der App</h3>
            </header>
            <p className="card-text">Die App bietet Routinen, Tagebuch, Skills und Datenteilung. Aki ist der freundliche Rahmen: verbindet Funktionen, gibt Halt und schafft Orientierung – ohne aufdringlich zu sein.</p>
            <ul className="q-list">
              <li><strong>Ohne Aki:</strong> klare, strukturierte, datensichere App.</li>
              <li><strong>Mit Aki:</strong> dieselben Funktionen, ergänzt um eine empathische Ebene – optional sichere Einbindung von Angehörigen.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
