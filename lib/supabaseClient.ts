import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = rawSupabaseUrl?.trim().replace(/\/$/, '') || 'https://example.supabase.co'
const supabaseAnonKey = rawSupabaseAnonKey?.trim() || 'public-anon-key'

if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
  // Avoid crashing builds; log once during runtime
  console.warn('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})