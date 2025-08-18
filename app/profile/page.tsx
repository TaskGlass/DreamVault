"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useInactivityTimeout } from '@/hooks/use-inactivity-timeout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Crown, Star, Zap, User, Mail, Calendar, Sparkles, Settings, LogOut, Edit3, Save, X } from 'lucide-react'

interface UsageData {
  plan: string
  period_start: string
  usage: {
    dream_interpretation: { used: number; limit: number; remaining: number }
    daily_horoscope: { used: number; limit: number; remaining: number }
    affirmation: { used: number; limit: number; remaining: number }
    moon_phase: { used: number; limit: number; remaining: number }
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [plansOpen, setPlansOpen] = useState(false)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    notifications: true,
    dream_reminders: true,
    weekly_reports: true
  })

  const router = useRouter()

  // Initialize inactivity timeout (3 minutes)
  useInactivityTimeout(3)

  useEffect(() => {
    const fetchProfile = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        router.replace('/sign-in')
        return
      }

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setEditForm({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          bio: profileData.bio || '',
          notifications: profileData.notifications ?? true,
          dream_reminders: profileData.dream_reminders ?? true,
          weekly_reports: profileData.weekly_reports ?? true
        })
      }

      // Fetch usage data
      try {
        const session = (await supabase.auth.getSession()).data.session
        const response = await fetch('/api/usage', {
          headers: { 
            'Content-Type': 'application/json',
            ...(session ? { Authorization: `Bearer ${session.access_token}` } : {})
          }
        })
        
        if (response.ok) {
          const usage = await response.json()
          setUsageData(usage)
        }
      } catch (error) {
        console.error('Error fetching usage data:', error)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        name: `${editForm.first_name} ${editForm.last_name}`.trim(), // Keep for compatibility
        bio: editForm.bio,
        notifications: editForm.notifications,
        dream_reminders: editForm.dream_reminders,
        weekly_reports: editForm.weekly_reports,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (!error) {
      setProfile({
        ...profile,
        ...editForm,
        name: `${editForm.first_name} ${editForm.last_name}`.trim()
      })
      setIsEditing(false)
    }
    setSaving(false)
  }

  const handleUpgrade = async (plan: string) => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      router.push('/sign-in')
      return
    }

    const email = session.user.email || undefined
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan, billingCycle: 'monthly' })
    })
    const data = await res.json()
    if (data?.url) window.location.href = data.url
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/home')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <Button variant="outline" onClick={handleSignOut} className="text-white border-white/20 hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile Information */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-400" />
              Personal Information
            </h2>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="text-white border-white/20 hover:bg-white/10">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="text-white border-white/20 hover:bg-white/10">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-300">Name</Label>
                <p className="text-white font-medium">{profile?.name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <p className="text-white font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile?.email}
                </p>
              </div>
              <div>
                <Label className="text-gray-300">Birthday</Label>
                <p className="text-white font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {profile?.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not set'}
                </p>
              </div>
              <div>
                <Label className="text-gray-300">Zodiac Sign</Label>
                <p className="text-white font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {profile?.zodiac || 'Not set'}
                </p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-gray-300">Bio</Label>
                <p className="text-white">{profile?.bio || 'No bio yet'}</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="first_name" className="text-gray-300">First Name</Label>
                <Input
                  id="first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="text-gray-300">Last Name</Label>
                <Input
                  id="last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                <textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full h-24 bg-white/10 border border-white/20 rounded-md p-3 text-white resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}
        </GlassCard>

        {/* Subscription & Usage */}
        <GlassCard>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Crown className="h-5 w-5 mr-2 text-yellow-400" />
            Subscription & Usage
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Current Plan: {usageData?.plan || 'Dream Lite'}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                  Dream Interpretations: {usageData?.usage.dream_interpretation.limit || 5}/month
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  Daily Horoscopes: {usageData?.usage.daily_horoscope.limit || 30}/month
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                  Affirmations: {usageData?.usage.affirmation.limit || 10}/month
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                  Moon Phases: {usageData?.usage.moon_phase.limit || 10}/month
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => handleUpgrade('Astral Voyager')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Astral Voyager
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-purple-600/20 border-purple-400/30 text-white hover:bg-purple-600/30"
                  onClick={() => setPlansOpen(true)}
                >
                  View All Plans
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">This Month's Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Dream Interpretations</span>
                    <span className="text-sm font-medium">
                      {usageData?.usage.dream_interpretation.remaining || 0}/{usageData?.usage.dream_interpretation.limit || 5}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ 
                        width: `${usageData ? ((usageData.usage.dream_interpretation.remaining / usageData.usage.dream_interpretation.limit) * 100) : 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Daily Horoscopes</span>
                    <span className="text-sm font-medium">
                      {usageData?.usage.daily_horoscope.remaining || 0}/{usageData?.usage.daily_horoscope.limit || 30}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${usageData ? ((usageData.usage.daily_horoscope.remaining / usageData.usage.daily_horoscope.limit) * 100) : 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Affirmations</span>
                    <span className="text-sm font-medium">
                      {usageData?.usage.affirmation.remaining || 0}/{usageData?.usage.affirmation.limit || 10}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${usageData ? ((usageData.usage.affirmation.remaining / usageData.usage.affirmation.limit) * 100) : 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Moon Phases</span>
                    <span className="text-sm font-medium">
                      {usageData?.usage.moon_phase.remaining || 0}/{usageData?.usage.moon_phase.limit || 10}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: `${usageData ? ((usageData.usage.moon_phase.remaining / usageData.usage.moon_phase.limit) * 100) : 100}%` 
                      }} 
                    />
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg">
                  <p className="text-sm text-green-300">
                    Great usage! You have {usageData?.usage.dream_interpretation.remaining || 0} dream interpretations, {usageData?.usage.daily_horoscope.remaining || 0} horoscopes, {usageData?.usage.affirmation.remaining || 0} affirmations, and {usageData?.usage.moon_phase.remaining || 0} moon phases remaining this month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Plans Modal */}
        <Dialog open={plansOpen} onOpenChange={setPlansOpen}>
          <DialogContent className="max-w-3xl bg-black border border-white/10">
            <DialogHeader>
              <DialogTitle>Choose a Plan</DialogTitle>
              <DialogDescription>Select the plan that fits your journey. You will be taken to a secure Stripe checkout.</DialogDescription>
            </DialogHeader>
            <div className="grid sm:grid-cols-3 gap-4 mt-2">
              {/* Dream Lite Plan */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-400" />
                  <div className="font-semibold">Dream Lite (Free)</div>
                </div>
                <ul className="text-sm text-gray-300 mb-3 list-disc list-inside space-y-1">
                  <li>5 dream interpretations</li>
                  <li>30 daily horoscopes</li>
                  <li>10 affirmations</li>
                  <li>10 moon phases</li>
                  <li>Basic dream journal</li>
                  <li>Community support</li>
                </ul>
                <Button variant="outline" className="w-full mt-auto" onClick={() => setPlansOpen(false)}>Stay on Free</Button>
              </div>
              {/* Lucid Explorer */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <div className="font-semibold">Lucid Explorer</div>
                </div>
                <ul className="text-sm text-gray-300 mb-3 list-disc list-inside space-y-1">
                  <li>50 dream interpretations</li>
                  <li>30 daily horoscopes</li>
                  <li>50 affirmations</li>
                  <li>50 moon phases</li>
                  <li>Advanced mood & emotion insights</li>
                  <li>Priority email support</li>
                </ul>
                <Button className="w-full mt-auto" onClick={() => handleUpgrade('Lucid Explorer')}>Choose Lucid Explorer</Button>
              </div>
              {/* Astral Voyager */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <div className="font-semibold">Astral Voyager</div>
                </div>
                <ul className="text-sm text-gray-300 mb-3 list-disc list-inside space-y-1">
                  <li>200 dream interpretations</li>
                  <li>30 daily horoscopes</li>
                  <li>200 affirmations</li>
                  <li>200 moon phases</li>
                  <li>Weekly dream pattern summaries</li>
                  <li>Shareable dream reports</li>
                  <li>Advanced symbol analysis</li>
                  <li>Priority support</li>
                </ul>
                <Button variant="outline" className="w-full mt-auto" onClick={() => handleUpgrade('Astral Voyager')}>Choose Astral Voyager</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
