import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request){
  try{
    const { amount, interval } = await req.json()
    const euros = Number(amount) || 0
    if(euros <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' } as any)

    const SITE_URL = process.env.SITE_URL || 'http://localhost:3000'
    const success = `${SITE_URL}/unterstuetzen/success`
    const cancel = `${SITE_URL}/unterstuetzen/cancel`

    // For one-time: mode=payment; for monthly: mode=subscription
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: interval === 'month' ? 'subscription' : 'payment',
      payment_method_types: ['card', 'sepa_debit'],
      billing_address_collection: 'auto',
      customer_creation: 'if_required',
      success_url: `${success}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel,
      line_items: [
        interval === 'month'
          ? {
              price_data: {
                currency: 'eur',
                product_data: { name: 'Aki – monatliche Unterstützung' },
                unit_amount: euros * 100,
                recurring: { interval: 'month' },
              },
              quantity: 1
            }
          : {
              price_data: {
                currency: 'eur',
                product_data: { name: 'Aki – einmalige Unterstützung' },
                unit_amount: euros * 100,
              },
              quantity: 1
            }
      ],
      metadata: { project: 'Aki', kind: interval === 'month' ? 'monthly' : 'one_time' }
    }

    const session = await stripe.checkout.sessions.create(params)
    return NextResponse.json({ url: session.url })
  }catch(err:any){
    console.error('Stripe error', err)
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 })
  }
}
