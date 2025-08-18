import type { SupabaseClient } from '@supabase/supabase-js'

type Feature = 'dream_interpretation' | 'daily_horoscope' | 'affirmation' | 'moon_phase'

// Updated plan limits with consistent naming and all features
const PLAN_LIMITS: Record<string, Partial<Record<Feature, number>>> = {
  'Dream Lite': { 
    dream_interpretation: 5, 
    daily_horoscope: 30,
    affirmation: 10,
    moon_phase: 10
  },
  'Lucid Explorer': { 
    dream_interpretation: 50, 
    daily_horoscope: 30,
    affirmation: 50,
    moon_phase: 50
  },
  'Astral Voyager': { 
    dream_interpretation: 200, 
    daily_horoscope: 30,
    affirmation: 200,
    moon_phase: 200
  },
}

// Plan mapping for backward compatibility
const PLAN_MAPPING: Record<string, string> = {
  'Free': 'Dream Lite',
  'Dream Lite': 'Dream Lite',
  'Lucid Explorer': 'Lucid Explorer',
  'Astral Voyager': 'Astral Voyager'
}

function currentMonthWindow() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const toDate = (d: Date) => d.toISOString().slice(0, 10)
  return { period_start: toDate(start), period_end: toDate(end) }
}

export async function getActivePlan(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  // Map old plan names to new ones for backward compatibility
  const plan = data?.plan || 'Dream Lite'
  return PLAN_MAPPING[plan] || plan
}

export async function checkAndConsumeUsage(
  supabase: SupabaseClient,
  userId: string,
  feature: Feature
) {
  const plan = await getActivePlan(supabase, userId)
  const limit = PLAN_LIMITS[plan]?.[feature]
  if (!limit) return { allowed: true, remaining: Infinity as number, plan }

  const { period_start, period_end } = currentMonthWindow()
  const { data: usage } = await supabase
    .from('usage_monthly')
    .select('*')
    .eq('user_id', userId)
    .eq('period_start', period_start)
    .single()

  const col = `${feature}_used`
  const used = (usage?.[col] as number) || 0
  const remaining = Math.max(0, (limit as number) - used)

  if (remaining <= 0) return { allowed: false, remaining: 0, plan, limit }

  if (!usage) {
    await supabase.from('usage_monthly').insert({
      user_id: userId,
      period_start,
      period_end,
      [col]: 1,
    })
  } else {
    await supabase
      .from('usage_monthly')
      .update({ [col]: used + 1 })
      .eq('id', usage.id)
  }

  return { allowed: true, remaining: remaining - 1, plan, limit }
}

// New function to get current usage without consuming
export async function getCurrentUsage(
  supabase: SupabaseClient,
  userId: string
) {
  const plan = await getActivePlan(supabase, userId)
  const { period_start } = currentMonthWindow()
  
  const { data: usage } = await supabase
    .from('usage_monthly')
    .select('*')
    .eq('user_id', userId)
    .eq('period_start', period_start)
    .single()

  const features: Feature[] = ['dream_interpretation', 'daily_horoscope', 'affirmation', 'moon_phase']
  const usageData: Record<Feature, { used: number; limit: number; remaining: number }> = {} as any

  features.forEach(feature => {
    const col = `${feature}_used`
    const used = (usage?.[col] as number) || 0
    const limit = PLAN_LIMITS[plan]?.[feature] || 0
    const remaining = Math.max(0, limit - used)
    
    usageData[feature] = { used, limit, remaining }
  })

  return {
    plan,
    period_start,
    usage: usageData
  }
}

// Function to reset usage for testing (development only)
export async function resetUsage(
  supabase: SupabaseClient,
  userId: string
) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot reset usage in production')
  }

  const { period_start } = currentMonthWindow()
  
  await supabase
    .from('usage_monthly')
    .delete()
    .eq('user_id', userId)
    .eq('period_start', period_start)
}

// Export plan limits for use in other parts of the app
export { PLAN_LIMITS, PLAN_MAPPING }


