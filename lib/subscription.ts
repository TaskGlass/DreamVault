import type { SupabaseClient } from '@supabase/supabase-js'

type Feature = 'dream_interpretation' | 'daily_horoscope'

const PLAN_LIMITS: Record<string, Partial<Record<Feature, number>>> = {
  Free: { dream_interpretation: 5, daily_horoscope: 30 },
  'Lucid Explorer': { dream_interpretation: 50, daily_horoscope: 30 },
  'Astral Voyager': { dream_interpretation: 200, daily_horoscope: 30 },
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
  return data?.plan || 'Free'
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

  const col = feature === 'dream_interpretation' ? 'dream_interpretation_used' : 'daily_horoscope_used'
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


