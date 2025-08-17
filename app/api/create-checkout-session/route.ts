import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validateInput, subscriptionSchema } from '@/lib/validation'
import { logSecurityEvent } from '@/lib/security'

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
  try {
    const body = await req.json()
    
    // Input validation
    const validation = validateInput(subscriptionSchema, body)
    if (!validation.success) {
      logSecurityEvent('INVALID_CHECKOUT_INPUT', { 
        errors: validation.errors,
        path: '/api/create-checkout-session' 
      }, req as any)
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.errors 
      }, { status: 400 })
    }

    const { email, plan, billingCycle = 'monthly', returnUrl } = validation.data
    
    if (!PRICE_IDS[plan]?.[billingCycle]) {
      logSecurityEvent('INVALID_PLAN_OR_BILLING', { 
        plan,
        billingCycle,
        path: '/api/create-checkout-session' 
      }, req as any)
      return NextResponse.json({ error: 'Invalid plan or billing cycle' }, { status: 400 })
    }

    // Create Stripe Checkout session
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    
    // Validate origin
    const allowedOrigins = [
      'http://localhost:3000',
      'https://yourdomain.com', // Replace with your actual domain
      process.env.ALLOWED_ORIGIN
    ].filter(Boolean)
    
    if (!allowedOrigins.includes(origin)) {
      logSecurityEvent('INVALID_ORIGIN', { 
        origin,
        allowedOrigins,
        path: '/api/create-checkout-session' 
      }, req as any)
      return NextResponse.json({ error: 'Invalid origin' }, { status: 400 })
    }
    
    // Use returnUrl for cancel_url so users return to where they started
    const cancelUrl = returnUrl 
      ? `${origin}${returnUrl}`
      : `${origin}/dashboard`
    
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
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: cancelUrl, // This is what Stripe uses for the back button
      metadata: { plan, billingCycle, returnUrl },
    })

    logSecurityEvent('CHECKOUT_SESSION_CREATED', { 
      plan,
      billingCycle,
      email,
      sessionId: session.id,
      path: '/api/create-checkout-session' 
    }, req as any)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    logSecurityEvent('CHECKOUT_SESSION_ERROR', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      path: '/api/create-checkout-session' 
    }, req as any)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}


