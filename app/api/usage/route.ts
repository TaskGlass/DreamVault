import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { getCurrentUsage } from '@/lib/subscription'
import { logSecurityEvent } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabase(req)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', { path: '/api/usage' }, req as any)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usageData = await getCurrentUsage(supabase, user.id)

    logSecurityEvent('USAGE_RETRIEVED', { 
      userId: user.id, 
      plan: usageData.plan,
      path: '/api/usage' 
    }, req as any)

    return NextResponse.json(usageData)
  } catch (error) {
    console.error('Error retrieving usage:', error)
    logSecurityEvent('API_ERROR', { 
      path: '/api/usage', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, req as any)
    return NextResponse.json({ error: 'Failed to retrieve usage data' }, { status: 500 })
  }
}
