
'use client'
import { useState } from 'react'

const PRESETS = [5, 10, 20, 50]

export default function UnterstuetzenPage(){
  const [amount, setAmount] = useState<number>(10)
  const [custom, setCustom] = useState<string>('')
  const [interval, setInterval] = useState<'one_time'|'month'>('one_time')
  const [loading, setLoading] = useState(false)

  const display = custom !== '' ? Math.max(0, Math.round(Number(custom))) : amount

  async function startCheckout(){
    try{
      setLoading(true)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: display, interval }),
      })
      const data = await res.json()
      if(data?.url){ window.location.href = data.url }
    }catch(e){
      console.error(e)
      alert('Konnte den Zahlungsprozess nicht starten. Bitte später erneut versuchen.')
    }finally{
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="container donate-wrap">
        <header className="donate-header">
          <h1 className="h1">Unterstützen</h1>
          <p className="lead">Hilf mit, Aki weiterzuentwickeln – einmalig oder monatlich.</p>
        </header>

        <div className="donate-grid">
          {/* Donate Card */}
          <div className="donate-card">
            {/* Interval Switch */}
            <div className="segment-toggle" role="tablist" aria-label="Zahlungsintervall">
              <button
                className={['segment', interval==='one_time' ? 'is-active' : ''].join(' ').trim()}
                onClick={()=>setInterval('one_time')}
                role="tab" aria-selected={interval==='one_time'}>
                Einmalig
              </button>
              <button
                className={['segment', interval==='month' ? 'is-active' : ''].join(' ').trim()}
                onClick={()=>setInterval('month')}
                role="tab" aria-selected={interval==='month'}>
                Monatlich
              </button>
            </div>

            {/* Amounts */}
            <div className="donate-amounts">
              {PRESETS.map(v => (
                <button key={v}
                  className={['amount', custom==='' && display===v ? 'is-active' : ''].join(' ').trim()}
                  onClick={()=>{ setAmount(v); setCustom('') }}>
                  {v}€
                </button>
              ))}
              <div className="amount amount--custom" title="Eigener Betrag">
                <input
                  aria-label="Eigener Betrag"
                  inputMode="numeric"
                  placeholder="Betrag"
                  value={custom}
                  onChange={(e)=>setCustom(e.target.value.replace(/\D/g,''))}
                />
                <span className="suffix">€</span>
              </div>
            </div>

            {/* CTA */}
            <div className="donate-actions">
              <button
                onClick={startCheckout}
                disabled={loading || display<=0}
                className="btn btn-primary btn-lg glow-hover press"
                style={{minWidth:320}}>
                {loading ? 'Lädt…' : interval==='month' ? `Monatlich unterstützen (${display}€)` : `Einmalig unterstützen (${display}€)`}
              </button>

              
              {/* Trust row */}
              <div className="trust-row">
                <img src="/icons/payments/payment-icons/visa.svg" alt="Visa" loading="lazy" />
                <img src="/icons/payments/payment-icons/mastercard.svg" alt="Mastercard" loading="lazy" />
                <img src="/icons/payments/payment-icons/apple-pay.svg" alt="Apple Pay" loading="lazy" />
                <img src="/icons/payments/payment-icons/google-pay.svg" alt="Google Pay" loading="lazy" />
                <img src="/icons/payments/payment-icons/sepa-lastschrift.svg" alt="SEPA Lastschrift" loading="lazy" />
                <img src="/icons/payments/payment-icons/klarna.svg" alt="Klarna" loading="lazy" />
                <img src="/icons/payments/payment-icons/stripe.svg" alt="Stripe" loading="lazy" />
              </div>
              <p className="donate-sec">Sichere Zahlung via Stripe · DSGVO-konform</p>

            </div>
          </div>

          {/* Info Card */}
          <div className="card fade-slide">
            <div className="card__body">
              <h2 className="h2">Wohin fließt das Geld?</h2>
              <ul className="list">
                <li><strong>Betrieb & Infrastruktur</strong> (Hosting, Monitoring, Sicherheit)</li>
                <li><strong>Weiterentwicklung</strong> (ruhige Tools, Barrierefreiheit, Mehrsprachigkeit)</li>
                <li><strong>Inhalte & Aufklärung</strong> (Texte, Audio, Kooperationen)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
