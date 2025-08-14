"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from './supabaseClient'

interface UserProfile {
  id: string
  first_name?: string
  last_name?: string
  name?: string
  email?: string
  birthday?: string
  zodiac?: string
  bio?: string
  notifications?: boolean
  dream_reminders?: boolean
  weekly_reports?: boolean
}

interface Dream {
  id: string
  title: string
  description: string
  date: string
  mood?: string
  symbols?: string[]
  lucidity?: boolean
  user_id: string
}

interface Subscription {
  id: string
  user_id: string
  plan_name: string
  price: string
  status: string
  created_at: string
}

interface UserContextType {
  profile: UserProfile | null
  dreams: Dream[]
  subscription: Subscription | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
  refreshDreams: () => Promise<void>
  refreshSubscription: () => Promise<void>
  refreshAll: () => Promise<void>
  addDream: (dream: Omit<Dream, 'id' | 'user_id'>) => Promise<void>
  updateDream: (dreamId: string, updates: Partial<Dream>) => Promise<void>
  deleteDream: (dreamId: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dreams, setDreams] = useState<Dream[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<{
    profile: number
    dreams: number
    subscription: number
  }>({
    profile: 0,
    dreams: 0,
    subscription: 0
  })

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  const isCacheValid = (type: keyof typeof lastFetch) => {
    return Date.now() - lastFetch[type] < CACHE_DURATION
  }

  const fetchProfile = async (force = false) => {
    if (!force && isCacheValid('profile') && profile) return

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        // Handle backward compatibility
        if (!profileData.first_name && !profileData.last_name && profileData.name) {
          const nameParts = profileData.name.trim().split(' ')
          profileData.first_name = nameParts[0] || ''
          profileData.last_name = nameParts.slice(1).join(' ') || ''
        }
        setProfile(profileData)
        setLastFetch(prev => ({ ...prev, profile: Date.now() }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchDreams = async (force = false) => {
    if (!force && isCacheValid('dreams') && dreams.length > 0) return

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data: dreamsData } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (dreamsData) {
        setDreams(dreamsData)
        setLastFetch(prev => ({ ...prev, dreams: Date.now() }))
      }
    } catch (error) {
      console.error('Error fetching dreams:', error)
    }
  }

  const fetchSubscription = async (force = false) => {
    if (!force && isCacheValid('subscription') && subscription) return

    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setSubscription(subData)
      setLastFetch(prev => ({ ...prev, subscription: Date.now() }))
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const refreshProfile = async () => {
    await fetchProfile(true)
  }

  const refreshDreams = async () => {
    await fetchDreams(true)
  }

  const refreshSubscription = async () => {
    await fetchSubscription(true)
  }

  const refreshAll = async () => {
    await Promise.all([
      fetchProfile(true),
      fetchDreams(true),
      fetchSubscription(true)
    ])
  }

  const addDream = async (dreamData: Omit<Dream, 'id' | 'user_id'>) => {
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data: newDream, error } = await supabase
        .from('dreams')
        .insert([{ ...dreamData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      if (newDream) {
        setDreams(prev => [newDream, ...prev])
        setLastFetch(prev => ({ ...prev, dreams: Date.now() }))
      }
    } catch (error) {
      console.error('Error adding dream:', error)
      throw error
    }
  }

  const updateDream = async (dreamId: string, updates: Partial<Dream>) => {
    try {
      const { data: updatedDream, error } = await supabase
        .from('dreams')
        .update(updates)
        .eq('id', dreamId)
        .select()
        .single()

      if (error) throw error

      if (updatedDream) {
        setDreams(prev => prev.map(dream => 
          dream.id === dreamId ? updatedDream : dream
        ))
        setLastFetch(prev => ({ ...prev, dreams: Date.now() }))
      }
    } catch (error) {
      console.error('Error updating dream:', error)
      throw error
    }
  }

  const deleteDream = async (dreamId: string) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId)

      if (error) throw error

      setDreams(prev => prev.filter(dream => dream.id !== dreamId))
      setLastFetch(prev => ({ ...prev, dreams: Date.now() }))
    } catch (error) {
      console.error('Error deleting dream:', error)
      throw error
    }
  }

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchProfile(),
        fetchDreams(),
        fetchSubscription()
      ])
      setIsLoading(false)
    }

    initializeData()
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshAll()
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
          setDreams([])
          setSubscription(null)
          setLastFetch({ profile: 0, dreams: 0, subscription: 0 })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value: UserContextType = {
    profile,
    dreams,
    subscription,
    isLoading,
    refreshProfile,
    refreshDreams,
    refreshSubscription,
    refreshAll,
    addDream,
    updateDream,
    deleteDream
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
