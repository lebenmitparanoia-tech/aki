'use client'
import { useState, ChangeEvent } from 'react'

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
      if (data?.url) window.location.href = data.url
    }catch(e){
      console.error(e)
      alert('Konnte den Zahlungsprozess nicht starten. Bitte später erneut versuchen.')
    }finally{
      setLoading(false)
    }
  }

  function onCustomChange(e: ChangeEvent<HTMLInputElement>){
    // nur Ziffern zulassen
    setCustom(e.target.value.replace(/\D/g, ''))
  }

  const isMonthly = interval === 'month'

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Page Head */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Unterstützen</h1>
        <p className="mt-2 text-base md:text-lg text-gray-600">
          Hilf mit, Aki weiterzuentwickeln – einmalig oder monatlich.
        </p>
      </header>

      {/* 2-column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donate Card */}
        <section
          aria-label="Spenden"
          className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur shadow-sm p-5 md:p-6"
        >
          {/* Interval switch */}
          <div
            role="tablist"
            aria-label="Zahlungsintervall"
            className="flex rounded-xl bg-gray-100 p-1 mb-4"
          >
            <button
              role="tab"
              aria-selected={interval==='one_time'}
              onClick={()=>setInterval('one_time')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                ${interval==='one_time' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-white'}`}
            >
              Einmalig
            </button>
            <button
              role="tab"
              aria-selected={interval==='month'}
              onClick={()=>setInterval('month')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                ${interval==='month' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-white'}`}
            >
              Monatlich
            </button>
          </div>

          {/* Amount presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {PRESETS.map(v => {
              const active = custom === '' && amount === v
              return (
                <button
                  key={v}
                  onClick={()=>{ setAmount(v); setCustom('') }}
                  className={`px-3 py-2 rounded-lg border text-sm transition
                    ${active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
                >
                  {v} €
                </button>
              )
            })}
          </div>

          {/* Custom amount */}
          <label className="block text-sm text-gray-700 mb-1" htmlFor="amount-custom">
            Eigener Betrag
          </label>
          <div className="relative mb-4">
            <input
              id="amount-custom"
              inputMode="numeric"
              placeholder="Betrag"
              value={custom}
              onChange={onCustomChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
          </div>

          {/* CTA */}
          <button
            onClick={startCheckout}
            disabled={loading || display<=0}
            className={`w-full rounded-lg px-4 py-3 text-white font-medium transition
              ${loading || display<=0 ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? 'Lädt…' : (isMonthly ? `Monatlich unterstützen (${display}€)` : `Einmalig unterstützen (${display}€)`)}
          </button>

          {/* Trust row */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-3 opacity-90">
              {/* Nutzt vorhandene Assets im public/icons/... */}
              <img src="/icons/payments/payment-icons/visa.svg"      alt="Visa"        loading="lazy" className="h-6" />
              <img src="/icons/payments/payment-icons/mastercard.svg" alt="Mastercard"  loading="lazy" className="h-6" />
              <img src="/icons/payments/payment-icons/apple-pay.svg"  alt="Apple Pay"   loading="lazy" className="h-6" />
              <img src="/icons/payments/payment-icons/sepa.svg"       alt="SEPA"        loading="lazy" className="h-6" />
              <img src="/icons/payments/payment-icons/klara.svg"      alt="Klarna"      loading="lazy" className="h-6" />
              <img src="/icons/payments/payment-icons/stripe.svg"     alt="Stripe"      loading="lazy" className="h-6" />
            </div>
            <p className="mt-2 text-sm text-gray-600">Sichere Zahlung via Stripe · DSGVO-konform</p>
          </div>
        </section>

        {/* Info Card */}
        <aside
          aria-label="Wohin fließt das Geld"
          className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur shadow-sm p-5 md:p-6"
        >
          <h2 className="text-lg font-semibold mb-3">Wohin fließt das Geld?</h2>
          <ul className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500" />
              <span><strong>Betrieb &amp; Infrastruktur:</strong> Hosting, Monitoring, Sicherheit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500" />
              <span><strong>Weiterentwicklung:</strong> ruhige Tools, Barrierefreiheit, Mehrsprachigkeit</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-indigo-500" />
              <span><strong>Inhalte &amp; Aufklärung:</strong> Texte, Audio, Kooperationen</span>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
