import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabaseClient'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerEmail = session.customer_email
    const subscriptionId = session.subscription as string
    // Fetch user by email
    const { data: user } = await supabase.from('profiles').select('id').eq('email', customerEmail).single()
    if (user) {
      await supabase.from('subscriptions').insert([
        {
          user_id: user.id,
          plan: session.metadata?.plan || 'unknown',
          status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: subscriptionId,
        },
      ])
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const stripeCustomerId = subscription.customer as string
    const status = subscription.status
    // Update subscription in Supabase
    await supabase.from('subscriptions').update({ status }).eq('stripe_customer_id', stripeCustomerId)
  }

  return NextResponse.json({ received: true })
} 