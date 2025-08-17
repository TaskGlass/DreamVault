import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { logSecurityEvent } from '@/lib/security'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    const rawBody = await req.text()

    if (!sig || !webhookSecret) {
      logSecurityEvent('STRIPE_WEBHOOK_ERROR', { 
        error: 'Missing signature or webhook secret',
        path: '/api/stripe-webhook' 
      }, req as any)
      return NextResponse.json({ error: 'Webhook configuration error.' }, { status: 500 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } catch (err) {
      logSecurityEvent('STRIPE_WEBHOOK_SIGNATURE_FAILED', { 
        error: err instanceof Error ? err.message : 'Unknown error',
        path: '/api/stripe-webhook' 
      }, req as any)
      return NextResponse.json({ error: 'Webhook signature verification failed.' }, { status: 400 })
    }

    logSecurityEvent('STRIPE_WEBHOOK_RECEIVED', { 
      eventType: event.type,
      path: '/api/stripe-webhook' 
    }, req as any)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_email || (session.customer_details?.email as string | undefined)
      const subscriptionId = session.subscription as string | undefined
      const plan = (session.metadata?.plan as string) || 'unknown'
      const billingCycle = (session.metadata?.billingCycle as string) || null

      let periodStart: string | null = null
      let periodEnd: string | null = null

      if (subscriptionId) {
        const sub = (await stripe.subscriptions.retrieve(subscriptionId)) as any
        if (sub.current_period_start) periodStart = new Date(sub.current_period_start * 1000).toISOString()
        if (sub.current_period_end) periodEnd = new Date(sub.current_period_end * 1000).toISOString()
      }

      if (customerEmail) {
        const supabaseAdmin = getSupabaseAdmin()
        const { data: user } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single()

        if (user) {
          await supabaseAdmin.from('subscriptions').upsert(
            {
              user_id: user.id,
              plan,
              status: 'active',
              billing_cycle: billingCycle,
              stripe_customer_id: (session.customer as string) || null,
              stripe_subscription_id: subscriptionId || null,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
          
          logSecurityEvent('SUBSCRIPTION_CREATED', { 
            userId: user.id,
            plan,
            billingCycle,
            path: '/api/stripe-webhook' 
          }, req as any)
        } else {
          logSecurityEvent('SUBSCRIPTION_USER_NOT_FOUND', { 
            email: customerEmail,
            plan,
            path: '/api/stripe-webhook' 
          }, req as any)
        }
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any
      const stripeCustomerId = subscription.customer as string
      const status = subscription.status
      const periodStart = subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null
      const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null
      
      // Update subscription in Supabase
      const supabaseAdmin = getSupabaseAdmin()
      await supabaseAdmin
        .from('subscriptions')
        .update({ status, current_period_start: periodStart, current_period_end: periodEnd, updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', stripeCustomerId)
        
      logSecurityEvent('SUBSCRIPTION_UPDATED', { 
        eventType: event.type,
        stripeCustomerId,
        status,
        path: '/api/stripe-webhook' 
      }, req as any)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error in Stripe webhook:', error)
    logSecurityEvent('STRIPE_WEBHOOK_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      path: '/api/stripe-webhook' 
    }, req as any)
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 })
  }
}


