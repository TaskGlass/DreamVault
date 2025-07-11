import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

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
  const { email, plan, billingCycle } = await req.json()
  if (!email || !plan || !billingCycle || !PRICE_IDS[plan]?.[billingCycle]) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [
      {
        price: PRICE_IDS[plan][billingCycle],
        quantity: 1,
      },
    ],
    success_url: `https://www.dreamvault.ai/home?checkout=success`,
    cancel_url: `https://www.dreamvault.ai/home?checkout=cancel`,
  })

  return NextResponse.json({ url: session.url })
} 