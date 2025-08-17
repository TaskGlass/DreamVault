import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (secure)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Client-side Supabase client (for browser use)
export const createClientSupabase = () => {
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const clientKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!clientUrl || !clientKey) {
    throw new Error('Missing client-side Supabase configuration')
  }
  
  return createClient(clientUrl, clientKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}