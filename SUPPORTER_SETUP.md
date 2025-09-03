# Unterstützen / Stripe-Setup (Aki)

## 1) Stripe Keys
- Lege `.env.local` an anhand von `.env.local.example`
- Fülle `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `SITE_URL`

## 2) Install
```bash
npm i stripe
```

## 3) Start
```bash
npm run dev
```

## 4) Produktion
- In Stripe ggf. Webhook für `checkout.session.completed` anlegen (optional).
- Rechtliches: Impressum, Datenschutzerklärung (Stripe als Auftragsverarbeiter nennen), Widerruf/Spenden-Hinweise.
