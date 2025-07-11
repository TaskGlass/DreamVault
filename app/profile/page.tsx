"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { User, Camera, Star, Crown, Zap, Settings, Bell, Moon, Heart, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"

const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 20" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20" },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        // Handle backward compatibility - if first_name/last_name are empty but name exists, parse it
        if (!profileData.first_name && !profileData.last_name && profileData.name) {
          const nameParts = profileData.name.trim().split(' ')
          profileData.first_name = nameParts[0] || ''
          profileData.last_name = nameParts.slice(1).join(' ') || ''
        }
        setProfile(profileData)
      }
      
      // Fetch subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      setCurrentPlan(subData)
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!profile?.id) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        name: `${profile.first_name} ${profile.last_name}`.trim(), // Keep name field for compatibility
        email: profile.email,
        birthday: profile.birthday,
        zodiac: profile.zodiac,
        bio: profile.bio,
        notifications: profile.notifications,
        dream_reminders: profile.dream_reminders,
        weekly_reports: profile.weekly_reports,
      })
      .eq("id", profile.id);
    setIsEditing(false);
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    }
  }

  const handleUpgrade = async (plan: string) => {
    if (!profile?.email) return
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: profile.email, plan }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  const selectedZodiac = zodiacSigns.find((sign) => sign.name === profile?.zodiac)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-glow flex items-center">
                <User className="h-6 w-6 mr-2 text-purple-400" />
                Profile
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your account
                <br />
                and spiritual preferences
              </p>
            </div>
            <Button
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          {/* Profile Card */}
          <GlassCard glow>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-2">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border-2 border-purple-400/20 shadow-lg">
                    <User className="h-16 w-16 text-purple-200" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-purple-600 hover:bg-purple-700 border-2 border-background"
                      variant="default"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 text-center lg:text-left space-y-4 min-w-0">
                {isEditing ? (
                  <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-300">
                          First Name
                        </Label>
                        <Input
                          id="first_name"
                          value={profile?.first_name || ''}
                          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                          className="bg-white/5 border-white/10 mt-1"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-300">
                          Last Name
                        </Label>
                        <Input
                          id="last_name"
                          value={profile?.last_name || ''}
                          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                          className="bg-white/5 border-white/10 mt-1"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="bg-white/5 border-white/10 mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}`
                          : profile?.name || 'Your Name'
                        }
                      </h2>
                      <p className="text-gray-300 text-lg">{profile?.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 px-3 py-1 text-sm font-medium">
                        Dream Explorer
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 px-3 py-1 text-sm font-medium">
                        {selectedZodiac?.symbol} {selectedZodiac?.name}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Plan Section */}
              <div className="flex-shrink-0">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/15 border border-purple-400/20 backdrop-blur-sm min-w-[200px]">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                      <Zap className={`h-8 w-8 ${currentPlan?.plan_name === "Astral Voyager" ? "text-purple-400" : "text-blue-400"}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{currentPlan?.plan_name}</h3>
                      <p className="text-gray-300 font-medium">{currentPlan?.price}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white font-medium mt-2" onClick={() => handleUpgrade('Lucid Explorer')}>Upgrade to Lucid Explorer</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white font-medium mt-2" onClick={() => handleUpgrade('Astral Voyager')}>Upgrade to Astral Voyager</Button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Spiritual Profile */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Spiritual Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  {isEditing ? (
                    <Input
                      id="birthday"
                      type="date"
                      value={profile?.birthday}
                      onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                      className="bg-white/5 border-white/10"
                    />
                  ) : (
                    <div className="flex items-center mt-2">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{new Date(profile?.birthday).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="zodiac">Zodiac Sign</Label>
                  {isEditing ? (
                    <Select
                      value={profile?.zodiac}
                      onValueChange={(value) => setProfile({ ...profile, zodiac: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign.name} value={sign.name}>
                            {sign.symbol} {sign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center mt-2">
                      <span className="text-2xl mr-2">{selectedZodiac?.symbol}</span>
                      <div>
                        <p className="font-medium">{selectedZodiac?.name}</p>
                        <p className="text-sm text-gray-400">{selectedZodiac?.dates}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">About Your Spiritual Journey</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={profile?.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="bg-white/5 border-white/10 min-h-24"
                    placeholder="Share your spiritual interests and dream goals..."
                  />
                ) : (
                  <p className="text-gray-300 mt-2 leading-relaxed">{profile?.bio}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Subscription Details */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-400" />
              Subscription & Usage
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Current Plan Features</h3>
                <ul className="space-y-2">
                  {currentPlan?.features?.split(',').map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Astral Voyager
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-purple-600/20 border-purple-400/30 text-white hover:bg-purple-600/30"
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
                      <span className="text-sm font-medium">{currentPlan?.dream_interpretations_remaining || 0}/15</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(currentPlan?.dream_interpretations_remaining || 0) / 15 * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tarot Readings</span>
                      <span className="text-sm font-medium">{currentPlan?.tarot_readings_remaining || 0}/15</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(currentPlan?.tarot_readings_remaining || 0) / 15 * 100}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg">
                    <p className="text-sm text-green-300">
                      Great usage! You have {currentPlan?.dream_interpretations_remaining || 0} dream interpretations and {currentPlan?.tarot_readings_remaining || 0} tarot readings remaining this month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Settings */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-400" />
              Preferences
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-400">Receive alerts for new insights</p>
                  </div>
                </div>
                <Switch
                  checked={profile?.notifications}
                  onCheckedChange={(checked) => setProfile({ ...profile, notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Dream Reminders</h3>
                    <p className="text-sm text-gray-400">Daily prompts to record your dreams</p>
                  </div>
                </div>
                <Switch
                  checked={profile?.dream_reminders}
                  onCheckedChange={(checked) => setProfile({ ...profile, dream_reminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-400 mr-3" />
                  <div>
                    <h3 className="font-medium">Weekly Reports</h3>
                    <p className="text-sm text-gray-400">Summary of your dream patterns</p>
                  </div>
                </div>
                <Switch
                  checked={profile?.weekly_reports}
                  onCheckedChange={(checked) => setProfile({ ...profile, weekly_reports: checked })}
                />
              </div>
            </div>
          </GlassCard>

          {/* Account Actions */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6">Account Management</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-start bg-purple-600/20 border-purple-400/30 text-white hover:bg-purple-600/30"
              >
                Export Dream Data
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-blue-600/20 border-blue-400/30 text-white hover:bg-blue-600/30"
              >
                Privacy Settings
              </Button>
              <Button
                variant="outline"
                className="justify-start bg-indigo-600/20 border-indigo-400/30 text-white hover:bg-indigo-600/30"
              >
                Change Password
              </Button>
              <Button variant="destructive" className="justify-start">
                Delete Account
              </Button>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
