import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Map plan names and billing cycles to Stripe Price IDs
const PRICE_IDS: Record<string, Record<string, string>> = {
  'Lucid Explorer': {
    monthly: 'price_1RjPiuDtVRnmcn0Cf1c4SsqW',
    yearly: 'price_1RjPjoDtVRnmcn0CLI7ytoqV',
  },
  'Astral Voyager': {
    monthly: 'price_1RjPkbDtVRnmcn0CN5hVl2FP',
    yearly: 'price_1RjPl5DtVRnmcn0CIVlmyoNA',
  },
}

export async function POST(req: NextRequest) {
  const { email, plan, billingCycle = 'monthly' } = await req.json()
  if (!plan || !billingCycle || !PRICE_IDS[plan]?.[billingCycle]) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Create Stripe Checkout session
  const origin = req.headers.get('origin') || 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email || undefined,
    line_items: [
      {
        price: PRICE_IDS[plan][billingCycle],
        quantity: 1,
      },
    ],
    success_url: `${origin}/home?checkout=success`,
    cancel_url: `${origin}/home?checkout=cancel`,
    metadata: { plan, billingCycle },
  })

  return NextResponse.json({ url: session.url })
}


