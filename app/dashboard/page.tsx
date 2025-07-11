"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  Sparkles,
  Stars,
  Zap,
  Crown,
  BookOpen,
  Heart,
  Calendar,
  Star,
  TrendingUp,
  ArrowRight,
  Plus,
  BarChart3,
  Shuffle,
  Eye,
  RefreshCw,
  Trash2,
  MoreVertical,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

const moodColors = {
  Peaceful: "bg-blue-500/20 text-blue-300",
  Confused: "bg-orange-500/20 text-orange-300",
  Curious: "bg-green-500/20 text-green-300",
  Anxious: "bg-red-500/20 text-red-300",
  Hopeful: "bg-purple-500/20 text-purple-300",
}

export default function DashboardPage() {
  const [dream, setDream] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [interpretation, setInterpretation] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [recentDreams, setRecentDreams] = useState<any[]>([])
  const [dreamStats, setDreamStats] = useState({ total: 0, month: 0, topMood: '', topSymbol: '' })
  const [userProfile, setUserProfile] = useState<{ name?: string; first_name?: string; last_name?: string; zodiac: string } | null>(null)
  const [horoscopeData, setHoroscopeData] = useState<{ horoscope: string; luckyElement: string; dreamFocus: string } | null>(null)
  const [refreshingHoroscope, setRefreshingHoroscope] = useState(false)
  const [deletingDreams, setDeletingDreams] = useState<Set<string>>(new Set())

  const zodiacSigns: Record<string, string> = {
    "Aries": "♈",
    "Taurus": "♉", 
    "Gemini": "♊",
    "Cancer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓"
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, first_name, last_name, zodiac')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        // Handle backward compatibility - if first_name/last_name are empty but name exists, parse it
        if (!profile.first_name && !profile.last_name && profile.name) {
          const nameParts = profile.name.trim().split(' ')
          profile.first_name = nameParts[0] || ''
          profile.last_name = nameParts.slice(1).join(' ') || ''
        }
        setUserProfile(profile)
        // Fetch personalized daily horoscope
        if (profile.zodiac) {
          try {
            const response = await fetch('/api/daily-horoscope', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                zodiacSign: profile.zodiac,
                userId: user.id 
              })
            })
            const horoscopeResult = await response.json()
            if (horoscopeResult.horoscope) {
              setHoroscopeData(horoscopeResult)
            }
          } catch (error) {
            console.error('Error fetching daily horoscope:', error)
          }
        }
      }

      // Fetch recent dreams
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3)
      setRecentDreams(dreams || [])
      
      // Fetch stats
      const { data: allDreams } = await supabase
        .from('dreams')
        .select('mood,symbols,date')
        .eq('user_id', user.id)
      if (allDreams) {
        const total = allDreams.length
        const month = allDreams.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).length
        const moodCounts: Record<string, number> = {}
        const symbolCounts: Record<string, number> = {}
        allDreams.forEach(d => {
          if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
          if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
        })
        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const rawTopSymbol = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        // Truncate top symbol to 1-2 words max
        const topSymbol = rawTopSymbol.split(' ').slice(0, 2).join(' ')
        setDreamStats({ total, month, topMood, topSymbol })
      }
    }
    fetchUserData()
  }, [])

  const analyzeDream = async () => {
    if (!dream.trim()) {
      toast({
        title: "Please enter your dream",
        description: "Share your dream to receive an interpretation",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Please interpret this dream: ${dream}`,
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to get interpretation")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const data = JSON.parse(line.slice(2))
                if (data.content) {
                  fullResponse += data.content
                }
              } catch (e) {
                // Ignore parsing errors for streaming data
              }
            }
          }
        }
      }

      if (fullResponse) {
        setInterpretation({
          title: "AI Dream Interpretation",
          summary: fullResponse,
          symbols: extractSymbols(fullResponse),
          emotions: extractEmotions(fullResponse),
          actions: extractActions(fullResponse),
        })

        toast({
          title: "Dream Interpreted! ✨",
          description: "Your dream analysis is ready below.",
        })
      }
    } catch (error) {
      console.error("Error analyzing dream:", error)
      toast({
        title: "Analysis Failed",
        description:
          error instanceof Error ? error.message : "There was an error interpreting your dream. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper functions to extract structured data from AI response
  const extractSymbols = (content: string) => {
    const symbolKeywords = [
      "water",
      "flying",
      "animals",
      "light",
      "darkness",
      "house",
      "car",
      "people",
      "death",
      "birth",
    ]
    const foundSymbols = symbolKeywords
      .filter((symbol) => content.toLowerCase().includes(symbol))
      .map((symbol) => `${symbol.charAt(0).toUpperCase() + symbol.slice(1)} - Symbolic meaning`)

    return foundSymbols.length > 0 ? foundSymbols : ["Symbolic elements detected in your dream"]
  }

  const extractEmotions = (content: string) => {
    const emotionKeywords = [
      "fear",
      "joy",
      "anxiety",
      "peace",
      "love",
      "anger",
      "hope",
      "curiosity",
      "sadness",
      "excitement",
    ]
    const foundEmotions = emotionKeywords
      .filter((emotion) => content.toLowerCase().includes(emotion))
      .map((emotion) => emotion.charAt(0).toUpperCase() + emotion.slice(1))

    return foundEmotions.length > 0 ? foundEmotions : ["Emotional themes", "Subconscious feelings"]
  }

  const extractActions = (content: string) => {
    return [
      "Reflect on the themes presented in your dream",
      "Consider how these symbols relate to your current life",
      "Journal about your emotional responses to this dream",
      "Practice mindfulness to connect with your subconscious",
    ]
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const navigateToPage = (path: string) => {
    router.push(path)
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const refreshHoroscope = async () => {
    if (!userProfile?.zodiac) {
      toast({
        title: "Missing zodiac sign",
        description: "Please set your zodiac sign in your profile first.",
        variant: "destructive",
      })
      return
    }

    setRefreshingHoroscope(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const response = await fetch('/api/daily-horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          zodiacSign: userProfile.zodiac,
          userId: user.id,
          forceRefresh: true
        })
      })

      const result = await response.json()
      if (result.horoscope) {
        setHoroscopeData(result)
        toast({
          title: "Horoscope refreshed! ✨",
          description: "Your daily horoscope has been updated with new cosmic insights.",
        })
      } else {
        throw new Error(result.error || 'Failed to refresh horoscope')
      }
    } catch (error) {
      console.error('Error refreshing horoscope:', error)
      toast({
        title: "Failed to refresh horoscope",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setRefreshingHoroscope(false)
    }
  }

  const deleteDream = async (dreamId: string, dreamTitle: string) => {
    setDeletingDreams(prev => new Set(prev).add(dreamId))
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId)

      if (error) {
        throw error
      }

      // Update local state to remove the deleted dream
      setRecentDreams(prev => prev.filter(dream => dream.id !== dreamId))
      
      // Refresh dream stats
      const user = (await supabase.auth.getUser()).data.user
      if (user) {
        const { data: allDreams } = await supabase
          .from('dreams')
          .select('mood,symbols,date')
          .eq('user_id', user.id)
        
        if (allDreams) {
          const total = allDreams.length
          const month = allDreams.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).length
          const moodCounts: Record<string, number> = {}
          const symbolCounts: Record<string, number> = {}
          allDreams.forEach(d => {
            if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
            if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
          })
          const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
          const rawTopSymbol = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
          const topSymbol = rawTopSymbol.split(' ').slice(0, 2).join(' ')
          setDreamStats({ total, month, topMood, topSymbol })
        }
      }

      toast({
        title: "Dream deleted",
        description: `"${dreamTitle}" has been removed from your journal.`,
      })
    } catch (error) {
      console.error('Error deleting dream:', error)
      toast({
        title: "Failed to delete dream",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setDeletingDreams(prev => {
        const newSet = new Set(prev)
        newSet.delete(dreamId)
        return newSet
      })
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-glow">
                {getGreeting()}, <span className="text-4xl lg:text-5xl">
                  {userProfile?.first_name 
                    ? userProfile.first_name
                    : (userProfile?.name?.split(' ')[0] || 'Dreamer')
                  } ✨
                </span>
              </h1>
              <p className="text-gray-400 mt-1 text-base">Welcome back to your dream sanctuary</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <GlassCard className="text-center p-3 sm:p-6">
              <BookOpen className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{dreamStats.total}</p>
              <p className="text-base text-gray-400">Total Dreams</p>
              <div className="flex items-center justify-center mt-1 text-center">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs md:text-sm text-green-400">+{dreamStats.month} this week</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-6">
              <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{dreamStats.month}</p>
              <p className="text-base text-gray-400">This Month</p>
              <div className="flex items-center justify-center mt-1 text-center">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs md:text-sm text-green-400">+{dreamStats.month}%</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-6">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{dreamStats.topMood}</p>
              <p className="text-base text-gray-400">Top Mood</p>
              <Badge className="mt-1 bg-blue-500/20 text-blue-300 text-xs">35%</Badge>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-6">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">{dreamStats.topSymbol}</p>
              <p className="text-base text-gray-400">Top Symbol</p>
              <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 text-xs">44%</Badge>
            </GlassCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Dream Input */}
              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Stars className="h-5 w-5 mr-2 text-purple-400" />
                  Share Your Dream
                </h2>
                <Textarea
                  placeholder="Describe your dream in detail... What did you see, feel, or experience?"
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  className="min-h-24 sm:min-h-32 bg-white/5 border-white/10 resize-none"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-0">
                  <p className="text-base text-gray-400">{dream.length}/500 characters</p>
                  <Button
                    size="sm"
                    onClick={analyzeDream}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Interpret Dream
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>

              {/* Interpretation Results */}
              {interpretation && (
                <GlassCard glow className="p-4 sm:p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-purple-300">{interpretation.title}</h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dream Summary</h3>
                      <p className="text-base text-gray-300 whitespace-pre-wrap">{interpretation.summary}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Key Symbols</h3>
                        <ul className="space-y-1">
                          {interpretation.symbols.map((symbol: string, index: number) => (
                            <li key={index} className="text-gray-300 text-base">
                              • {symbol}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Emotions Detected</h3>
                        <div className="flex flex-wrap gap-2">
                          {interpretation.emotions.map((emotion: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-purple-500/20">
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToPage("/journal")}
                        className="w-full sm:w-auto"
                      >
                        Save to Journal
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToPage("/readings")}
                        className="w-full sm:w-auto"
                      >
                        Get Tarot Reading
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Quick Actions */}
              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-16 sm:h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20 p-2"
                    onClick={() => navigateToPage("/journal")}
                  >
                    <Plus className="h-6 w-6 mb-1 text-purple-400" />
                    <span className="text-sm">New Entry</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 sm:h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20 p-2"
                    onClick={() => navigateToPage("/insights")}
                  >
                    <BarChart3 className="h-6 w-6 mb-1 text-blue-400" />
                    <span className="text-sm">View Insights</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 sm:h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20 p-2"
                    onClick={() => navigateToPage("/readings")}
                  >
                    <Shuffle className="h-6 w-6 mb-1 text-pink-400" />
                    <span className="text-sm">Tarot Reading</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-16 sm:h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20 p-2"
                    onClick={() => navigateToPage("/readings")}
                  >
                    <Eye className="h-6 w-6 mb-1 text-green-400" />
                    <span className="text-sm">Affirmations</span>
                  </Button>
                </div>
              </GlassCard>

              {/* Recent Dreams */}
              <GlassCard className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                    Recent Dreams
                  </h2>
                  <Link href="/journal" scroll={true}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 md:text-sm md:px-3 md:py-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 w-full sm:w-auto"
                      onClick={() => navigateToPage("/journal")}
                    >
                      View All
                      <ArrowRight className="h-3 w-3 ml-1 md:h-4 md:w-4 md:ml-2 text-white" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentDreams.map((dream) => (
                    <div
                      key={dream.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors gap-2 sm:gap-0"
                    >
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigateToPage("/journal")}>
                        <h3 className="text-base sm:text-lg font-medium truncate">{dream.title}</h3>
                        <p className="text-sm sm:text-base text-gray-400">
                          {new Date(dream.date).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dream.symbols.slice(0, 2).map((symbol: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          className={`${moodColors[dream.mood as keyof typeof moodColors] || "bg-gray-500/20"}`}
                        >
                          {dream.mood}
                        </Badge>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                disabled={deletingDreams.has(dream.id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-400 cursor-pointer">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Dream
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Dream</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{dream.title}"? This action cannot be undone and will permanently remove this dream from your journal.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDream(dream.id, dream.title)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingDreams.has(dream.id)}
                              >
                                {deletingDreams.has(dream.id) ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Daily Horoscope */}
              <GlassCard className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    Today's Horoscope
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshHoroscope}
                    disabled={refreshingHoroscope}
                    className="bg-white/5 hover:bg-white/10 border-white/20"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingHoroscope ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-4xl mr-3">
                        {userProfile?.zodiac ? zodiacSigns[userProfile.zodiac] || "⭐" : "⭐"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-300">
                          {userProfile?.zodiac || "Your Sign"}
                        </h3>
                        <p className="text-base text-gray-400">
                          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300">★★★★☆</Badge>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-slate-500/10 rounded-lg p-3 sm:p-4">
                    {horoscopeData?.horoscope ? (
                      (() => {
                        const parts = horoscopeData.horoscope.split('\n\nCosmic tip:')
                        const mainReading = parts[0]
                        const cosmicTip = parts[1]
                        
                        return (
                          <div className="space-y-4">
                            <p className="text-base text-gray-300 leading-relaxed">
                              {mainReading}
                            </p>
                            {cosmicTip && (
                              <div className="border-t border-white/10 pt-3">
                                <p className="text-sm font-medium text-yellow-300 mb-2">✨ Cosmic tip:</p>
                                <p className="text-sm text-gray-300 italic leading-relaxed">
                                  {cosmicTip.trim()}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })()
                    ) : (
                      <p className="text-base text-gray-300 leading-relaxed">
                        Today brings powerful cosmic energy that aligns perfectly with your dream work. The moon's position enhances your intuitive abilities, making this an excellent time for dream interpretation and spiritual reflection.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Lucky Element</p>
                      <p className="text-base font-medium text-purple-300">
                        {horoscopeData?.luckyElement || "Spirit"}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Dream Focus</p>
                      <p className="text-base font-medium text-blue-300">
                        {horoscopeData?.dreamFocus || "Symbols"}
                      </p>
                    </div>
                  </div>

                  <Link href="/readings" scroll={true}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 mt-4 sm:mt-8"
                      onClick={() => {
                        navigateToPage("/readings")
                        // Set a flag to show horoscope on readings page
                        sessionStorage.setItem("showHoroscope", "true")
                      }}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Full Reading
                    </Button>
                  </Link>
                </div>
              </GlassCard>

              {/* Subscription Status */}
              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                  Your Plan
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Dream Lite</h3>
                      <p className="text-base text-gray-400">Free Plan</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base">Dream Interpretations</span>
                      <span className="text-base font-medium">5/5</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <p className="text-sm text-gray-400 mt-1">0 dream interpretations remaining this month</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base">Tarot Readings</span>
                      <span className="text-base font-medium">3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-sm text-gray-400 mt-1">2 tarot readings remaining this month</p>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => navigateToPage("/profile")}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </div>
              </GlassCard>

              {/* Daily Affirmation */}
              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-400" />
                  Daily Affirmation
                </h2>
                <div className="text-center py-4">
                  <div className="text-3xl mb-3">✨</div>
                  <blockquote className="text-base font-medium text-purple-300 mb-3">
                    "I trust my inner wisdom and embrace the messages my dreams bring to my conscious mind."
                  </blockquote>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
