# DreamVault Stripe Integration Setup Guide

## 🚀 Complete Stripe Integration Implementation

Your DreamVault app now has a complete Stripe integration with usage-based billing! Here's what has been implemented and what you need to do to complete the setup.

## ✅ What's Been Implemented

### 1. **Database Schema** (`database_schema.sql`)
- Complete database structure with all necessary tables
- Row Level Security (RLS) policies for data protection
- Usage tracking table (`usage_monthly`)
- Subscription management table
- Proper indexes and triggers

### 2. **Enhanced Subscription System** (`lib/subscription.ts`)
- Consistent plan naming across the app
- Usage tracking for all features
- Backward compatibility with existing data
- New functions for usage management

### 3. **API Integration**
- All APIs now use usage tracking
- New `/api/usage` endpoint for real-time usage data
- Enhanced error handling and security logging

### 4. **Updated UI Components**
- Profile page shows real usage data
- Pricing component matches new plan structure
- Consistent feature limits across the app

## 🔧 Setup Steps

### Step 1: Run Database Schema

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to the SQL Editor

2. **Run the Database Schema**
   - Copy the contents of `database_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Check that these tables exist:
     - `profiles`
     - `subscriptions`
     - `usage_monthly`
     - `dreams`
     - `daily_horoscopes`

### Step 2: Update Stripe Price IDs

1. **Go to your Stripe Dashboard**
   - Navigate to Products & Prices
   - Create or update your products

2. **Update Price IDs in Code**
   ```typescript
   // app/api/create-checkout-session/route.ts
   const PRICE_IDS: Record<string, Record<string, string>> = {
     'Lucid Explorer': {
       monthly: 'price_YOUR_MONTHLY_PRICE_ID',
       yearly: 'price_YOUR_YEARLY_PRICE_ID',
     },
     'Astral Voyager': {
       monthly: 'price_YOUR_MONTHLY_PRICE_ID',
       yearly: 'price_YOUR_YEARLY_PRICE_ID',
     },
   }
   ```

### Step 3: Configure Environment Variables

Make sure these environment variables are set:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Security
ALLOWED_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

### Step 4: Set Up Stripe Webhook

1. **In Stripe Dashboard**
   - Go to Webhooks
   - Create a new webhook endpoint
   - URL: `https://yourdomain.com/api/stripe-webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. **Copy Webhook Secret**
   - Copy the webhook signing secret
   - Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing the Integration

### Test Usage Tracking

1. **Create a test user**
2. **Try using features**:
   - Dream interpretation (chat)
   - Daily horoscope
   - Generate affirmation
   - Generate moon phase

3. **Check usage in profile page**
   - Should show real-time usage data
   - Progress bars should update

### Test Subscription Flow

1. **Try upgrading to a paid plan**
2. **Verify Stripe checkout works**
3. **Check webhook processing**
4. **Verify subscription status updates**

## 📊 Plan Limits Summary

| Plan | Dream Interpretations | Daily Horoscopes | Affirmations | Moon Phases |
|------|---------------------|------------------|--------------|-------------|
| Dream Lite (Free) | 5/month | 30/month | 10/month | 10/month |
| Lucid Explorer | 50/month | 30/month | 50/month | 50/month |
| Astral Voyager | 200/month | 30/month | 200/month | 200/month |

## 🔍 Monitoring & Debugging

### Check Usage Data
```sql
-- View current month usage for a user
SELECT * FROM usage_monthly 
WHERE user_id = 'user_uuid' 
AND period_start = '2024-01-01';
```

### Check Subscriptions
```sql
-- View active subscriptions
SELECT * FROM subscriptions 
WHERE status = 'active';
```

### Reset Usage (Development Only)
```typescript
// In development, you can reset usage for testing
import { resetUsage } from '@/lib/subscription'
await resetUsage(supabase, userId)
```

## 🚨 Important Notes

1. **Backward Compatibility**: The system handles old plan names ("Free" → "Dream Lite")
2. **Security**: All API endpoints now require authentication and track usage
3. **Rate Limiting**: Still in place alongside usage limits
4. **Error Handling**: Graceful handling when users exceed limits

## 🎉 You're Done!

Your DreamVault app now has:
- ✅ Complete Stripe integration
- ✅ Usage-based billing
- ✅ Real-time usage tracking
- ✅ Secure subscription management
- ✅ Consistent plan structure
- ✅ Enhanced security measures

The app will now properly track usage, enforce limits, and provide a seamless subscription experience for your users!
