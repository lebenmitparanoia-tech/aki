import Image from 'next/image'
import Icon from '@/components/ui/Icon'
import SplitText from '@/components/ui/SplitText'

export default function AboutAki(){
  return (
    <section id="wer-ist-aki" className="about spaced">
      <div className="container">
        {/* Titel mit animiertem Gradient-Text */}
        <h2 className="section-title section-title--anim">
          <SplitText text="Wer ist Aki?" />
        </h2>
        <h3 className="section-title section-title--anim-alt">Aki erklärt, erinnert und orientiert</h3>
<p className="section-sub">ruhig, respektvoll und ohne Druck</p>
<div className="section-divider" aria-hidden="true"></div>

        <div className="about-grid">
          {/* Wer ist Aki? */}
          <article className="about-card card card--compact glass electric-border accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="users" size={18} /></span>
              <h3 className="card-title">Wer ist Aki?</h3>
            </header>
            <hr className="card-divider" />
            <div className="card-body with-illustration side-by-side">
              <div className="card-textflow text-measure">
                <p><strong>Aki ist ein optionaler, digitaler Begleiter</strong> innerhalb der Web‑App <em>Leben mit Paranoia</em>. Er wurde bewusst so gestaltet, dass er ruhig, einfühlsam und nicht überfordernd wirkt.</p>
                <p>Aki ist kein medizinischer Ratgeber und ersetzt keine professionelle Therapie – vielmehr ist er eine freundliche Stimme im Hintergrund, die Orientierung gibt, Routinen strukturiert und Sicherheit vermittelt.</p>
              </div>
              <figure className="fig">
                <Image src="/img/aki/aki-sit-front.svg" width={140} height={140} alt="Aki sitzt freundlich" priority />
                <figcaption className="aki-caption">Aki – ruhig & einfühlsam</figcaption>
              </figure>
            </div>
          </article>

          {/* Rolle von Aki */}
          <article className="about-card card card--compact glass accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="info" size={18} /></span>
              <h3 className="card-title">Die Rolle von Aki</h3>
            </header>
            <hr className="card-divider" />
            <ul className="bullet-list tight relaxed text-measure">
              <li><strong>Verständlich erklären:</strong> Funktionen ohne Fachjargon oder komplexe Menüs.</li>
              <li><strong>Sanft erinnern:</strong> Tagebuch, Skills, Medikamente – ohne Druck.</li>
              <li><strong>Krisenhinweis:</strong> zeigt erreichbare professionelle Hilfe statt Eigenlösungen.</li>
              <li><strong>Je nach Wunsch:</strong> fast unsichtbar im Hintergrund oder aktiver mit Tipps.</li>
            </ul>
          </article>

          {/* Warum Aki */}
          <article className="about-card card card--compact glass accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="sparkle" size={18} /></span>
              <h3 className="card-title">Warum Aki?</h3>
            </header>
            <hr className="card-divider" />
            <div className="value-grid compact">
              <div className="value-card min">
                <h4>Ruhig &amp; deutschsprachig</h4>
                <p>Keine hektischen Animationen, kein Push‑Übermaß.</p>
              </div>
              <div className="value-card min">
                <h4>Vertrauenswürdig</h4>
                <p>Keine sensiblen Abfragen, keine versteckten Speicherungen.</p>
              </div>
              <div className="value-card min">
                <h4>Individuell anpassbar</h4>
                <p>Du wählst: minimal bis regelmäßige Begleitung.</p>
              </div>
            </div>
          </article>

          {/* Was macht Aki konkret? */}
          <article className="about-card card card--compact glass accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="checklist" size={18} /></span>
              <h3 className="card-title">Was macht Aki konkret?</h3>
            </header>
            <hr className="card-divider" />
            <div className="two-col">
              <ul className="bullet-list tight relaxed text-measure">
                <li><strong>Alltag strukturieren:</strong> erinnert an Routinen, Termine, Skills.</li>
                <li><strong>Symptome reflektieren:</strong> kurze Fragen fürs Tagebuch.</li>
                <li><strong>Verbindungen herstellen:</strong> sanfte Hinweise auf Muster/Trends.</li>
              </ul>
              <ul className="bullet-list tight relaxed text-measure">
                <li><strong>Sicherheit erhöhen:</strong> klare Notfall‑Buttons zu Kontakten/Hilfsangeboten.</li>
                <li><strong>Begleiter statt Therapeut:</strong> keine Diagnosen, sondern Orientierung.</li>
                <li><strong>Brücke zu Angehörigen:</strong> E2E‑verschlüsselte Verbindung; Einblicke nur nach Freigabe, widerrufbar.</li>
              </ul>
            </div>
            <div className="card-illu-row small">
              <figure className="fig"><Image src="/img/aki/aki-thinking.svg" width={120} height={120} alt="Aki denkt nach" /><figcaption>Erklärt & reflektiert</figcaption></figure>
              <figure className="fig"><Image src="/img/aki/aki-lying-side.svg" width={120} height={120} alt="Aki liegt entspannt" /><figcaption>Ruhige Begleitung</figcaption></figure>
              <figure className="fig"><Image src="/img/aki/aki-stretch.svg" width={120} height={120} alt="Aki streckt sich" /><figcaption>Ohne Druck</figcaption></figure>
            </div>
          </article>

          {/* Datenschutz & Kontrolle */}
          <article className="about-card card card--compact glass accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="lock-closed" size={20} /></span>
              <h3 className="card-title">Datenschutz &amp; Kontrolle</h3>
            </header>
            <hr className="card-divider" />
            <div className="pill-trio">
              <span className="pill">Datensparsamkeit</span>
              <span className="pill">Transparenz</span>
              <span className="pill">Kontrolle</span>
            </div>
            <p className="muted text-measure">Aki verarbeitet nur, was notwendig ist – jede Aktion bleibt nachvollziehbar.

            Nutzer:innen behalten jederzeit die Hoheit über ihre Daten, inklusive der Verbindung zu Angehörigen.</p>
            <div className="ds-banner">
              <div className="ds-banner-content">
                <span className="icon-badge" aria-hidden="true">🔒</span>
                <span>DSGVO‑konform · Keine versteckten Daten · Volle Kontrolle</span>
              </div>
            </div>
            <p className="muted text-measure">Freigaben sind jederzeit widerrufbar. Ende‑zu‑Ende‑verschlüsselte Verbindungen und klare Opt‑ins sorgen dafür, dass <em>deine</em> Daten bei dir bleiben.</p>
            
          </article>

          {/* Kontext */}
          <article className="about-card card card--compact glass accent">
            <header className="card-head">
              <span className="icon-badge"><Icon name="notebook" size={18} /></span>
              <h3 className="card-title">Aki im Kontext der App</h3>
            </header>
            <hr className="card-divider" />
            <div className="compare">
              <div className="card glass card--compact">
                <h4 className="card-title">Ohne Aki</h4>
                <p className="card-text">Klar, strukturiert und datensicher.</p>
              </div>
              <div className="card glass card--compact">
                <h4 className="card-title">Mit Aki</h4>
                <p className="card-text">Empathischer Rahmen: motiviert, erinnert, begleitet – bei Wunsch sichere Einbindung von Angehörigen.</p>
              </div>
            </div>
            <p className="about-summary text-measure">Kurz gesagt: Aki ist ein leiser Begleiter – ruhig, respektvoll und unterstützend. Er bringt Struktur, ohne Kontrolle. Er schafft Vertrauen, ohne Daten zu sammeln.</p>
            
          </article>
        </div>
      </div>
    </section>
  )
}
