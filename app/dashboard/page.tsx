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
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { DreamInterpretation } from "@/components/dream-interpretation"

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
  const [isSaving, setIsSaving] = useState(false)

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
        // Get the most meaningful word from the top symbol (skip articles like "the", "a", "an")
        const words = rawTopSymbol.split(' ')
        const meaningfulWords = words.filter(word => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()))
        const topSymbol = meaningfulWords[0] || words[0] || ''
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

    if (dream.trim().length < 100) {
      toast({
        title: "Dream too short",
        description: "Please provide at least 100 characters for a detailed interpretation",
        variant: "destructive",
      })
      return
    }

    if (dream.trim().length > 500) {
      toast({
        title: "Dream too long",
        description: "Please keep your dream description under 500 characters",
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

      // Simple approach: read the response as text
      let fullResponse = ""

      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          console.log("Raw chunk:", chunk)
          fullResponse += chunk
        }
      }

      console.log("Complete response:", fullResponse)

      // Parse out just the content from the AI SDK format
      let parsedContent = ""
      const lines = fullResponse.split('\n')
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            // Handle AI SDK streaming format - lines like 0:"text content"
            if (line.startsWith('0:')) {
              const jsonContent = line.slice(2) // Remove "0:" prefix
              const data = JSON.parse(jsonContent)
              if (typeof data === 'string') {
                parsedContent += data
              } else if (data.content) {
                parsedContent += data.content
              }
            }
          } catch (e) {
            // Skip parsing errors
            console.log("Parsing error for line:", line, e)
          }
        }
      }

      console.log("Parsed content:", parsedContent)

      if (parsedContent.trim()) {
        console.log("Setting interpretation state with parsed content...")
        
        // Clean up content - remove any AI references
        const cleanedContent = parsedContent.trim()
          .replace(/\bAI\b/g, '') // Remove standalone "AI" words
          .replace(/artificial intelligence/gi, '') // Remove "artificial intelligence"
          .replace(/\s+/g, ' ') // Clean up extra spaces
          .trim()
        
        setInterpretation({
          title: "Dream Interpretation",
          content: cleanedContent,
        })
        console.log("Interpretation state set successfully!")

        toast({
          title: "Dream Interpreted! ✨",
          description: "Your dream analysis is ready below.",
        })
      } else {
        console.log("No parsable content found. Raw response:", fullResponse)
        // Fallback: use raw response if no parsed content
        if (fullResponse.trim()) {
          // Clean raw response too
          const cleanedRaw = fullResponse.trim()
            .replace(/\bAI\b/g, '')
            .replace(/artificial intelligence/gi, '')
            .replace(/\s+/g, ' ')
            .trim()
            
          setInterpretation({
            title: "Dream Interpretation",
            content: cleanedRaw,
          })
          toast({
            title: "Dream Interpreted! ✨",
            description: "Your dream analysis is ready below.",
          })
        } else {
          throw new Error("No content received")
        }
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

  const saveDreamToJournal = async () => {
    if (!dream.trim() || !interpretation) {
      toast({
        title: "Nothing to save",
        description: "Please enter a dream and get an interpretation first.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to save dreams.",
          variant: "destructive",
        })
        return
      }

      // Extract symbols from the interpretation
      const extractSymbols = (content: string): string[] => {
        const symbols: string[] = []
        // Look for section headers that might be symbols
        const sections = content.split(/\*\*(.+?)\*\*/g)
        for (let i = 1; i < sections.length; i += 2) {
          const header = sections[i]
          if (header && 
              !header.toLowerCase().includes('actionable') &&
              !header.toLowerCase().includes('emotional') &&
              !header.toLowerCase().includes('summary') &&
              !header.toLowerCase().includes('action') &&
              !header.toLowerCase().includes('tone') &&
              header.length < 50) {
            symbols.push(header.trim())
          }
        }
        return symbols.slice(0, 5) // Limit to 5 symbols
      }

      // Generate a title from the first few words of the dream
      const generateTitle = (dreamText: string): string => {
        const words = dreamText.trim().split(' ').slice(0, 6)
        let title = words.join(' ')
        if (title.length > 40) {
          title = title.substring(0, 37) + '...'
        }
        return title || 'Dream Entry'
      }

      const symbols = extractSymbols(interpretation.content)
      const title = generateTitle(dream)
      
      // Save the dream to the database
      console.log('Attempting to save dream with data:', {
        user_id: user.id,
        title: title,
        description: dream.trim(),
        interpretation: interpretation.content.substring(0, 100) + '...', // First 100 chars for log
        date: new Date().toISOString().split('T')[0],
        mood: 'Reflective',
        symbols: symbols,
        intensity: 'Medium',
        duration: 'Unknown',
        lucidity: false
      })

      // Try the full insert first
      let { data, error } = await supabase
        .from('dreams')
        .insert([
          {
            user_id: user.id,
            title: title,
            description: dream.trim(),
            interpretation: interpretation.content,
            date: new Date().toLocaleDateString('en-CA'), // Today's date in YYYY-MM-DD format
            mood: 'Reflective', // Default mood, could be enhanced later
            symbols: symbols,
            intensity: 'Medium', // Default intensity
            duration: 'Unknown', // Default duration
            lucidity: false, // Default to non-lucid
            created_at: new Date().toISOString()
          }
        ])
        .select()

      console.log('Save result:', { data, error })

      // If that fails, try a simpler version with only essential fields (but still include interpretation)
      if (error) {
        console.warn('Full insert failed, trying simplified version...', error)
        
        const simpleInsert = await supabase
          .from('dreams')
          .insert([
            {
              user_id: user.id,
              title: title,
              description: dream.trim(),
              interpretation: interpretation.content,
              date: new Date().toLocaleDateString('en-CA'),
              mood: 'Reflective',
              symbols: symbols
            }
          ])
          .select()
        
        data = simpleInsert.data
        error = simpleInsert.error
        
        console.log('Simple insert result:', { data, error })
      }

      if (error) {
        console.error('Supabase error details:', error)
        throw new Error(`Database error: ${error.message || error.code || JSON.stringify(error)}`)
      }

      // Update recent dreams list
      const { data: updatedDreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3)
      
      setRecentDreams(updatedDreams || [])

      // Update dream stats
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
        // Get the most meaningful word from the top symbol (skip articles like "the", "a", "an")
        const words = rawTopSymbol.split(' ')
        const meaningfulWords = words.filter(word => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()))
        const topSymbol = meaningfulWords[0] || words[0] || ''
        setDreamStats({ total, month, topMood, topSymbol })
      }

      // Clear the current dream and interpretation
      setDream('')
      setInterpretation(null)

      toast({
        title: "Dream saved! ✨",
        description: `"${title}" has been added to your dream journal.`,
      })
    } catch (error) {
      console.error('Error saving dream:', error)
      toast({
        title: "Failed to save dream",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
        // Get the most meaningful word from the top symbol (skip articles like "the", "a", "an")
        const words = rawTopSymbol.split(' ')
        const meaningfulWords = words.filter(word => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()))
        const topSymbol = meaningfulWords[0] || words[0] || ''
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
            <GlassCard className="text-center p-3 sm:p-4 md:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-center">
                <BookOpen className="h-6 w-6 sm:h-6 sm:w-6 text-purple-400 mx-auto mb-2 flex-shrink-0" />
                <p className="text-3xl sm:text-3xl font-bold leading-none mb-1">{dreamStats.total}</p>
                <p className="text-base sm:text-base text-gray-400 leading-tight">Total Dreams</p>
              </div>
              <div className="flex items-center justify-center mt-2 flex-shrink-0">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-xs text-green-400 leading-none">+1 this week</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-4 md:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-center">
                <Calendar className="h-6 w-6 sm:h-6 sm:w-6 text-blue-400 mx-auto mb-2 flex-shrink-0" />
                <p className="text-3xl sm:text-3xl font-bold leading-none mb-1">{dreamStats.month}</p>
                <p className="text-base sm:text-base text-gray-400 leading-tight">This Month</p>
              </div>
              <div className="flex items-center justify-center mt-2 flex-shrink-0">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1 flex-shrink-0" />
                <span className="text-sm sm:text-xs text-green-400 leading-none">+1%</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-4 md:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-center">
                <Heart className="h-6 w-6 sm:h-6 sm:w-6 text-pink-400 mx-auto mb-2 flex-shrink-0" />
                <p className="text-2xl sm:text-2xl md:text-3xl font-bold leading-none mb-1 truncate w-full px-1" title={dreamStats.topMood || 'Peace'}>
                  {dreamStats.topMood || 'Peace'}
                </p>
                <p className="text-base sm:text-base text-gray-400 leading-tight">Top Mood</p>
              </div>
              <div className="flex justify-center mt-2 flex-shrink-0">
                <Badge className="bg-blue-500/20 text-blue-300 text-sm sm:text-xs px-2 py-1">35%</Badge>
              </div>
            </GlassCard>

            <GlassCard className="text-center p-3 sm:p-4 md:p-6 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-center">
                <Zap className="h-6 w-6 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-2 flex-shrink-0" />
                <p className="text-2xl sm:text-2xl md:text-3xl font-bold leading-none mb-1 truncate w-full px-1" title={dreamStats.topSymbol || 'Skyscraper'}>
                  {dreamStats.topSymbol || 'Skyscraper'}
                </p>
                <p className="text-base sm:text-base text-gray-400 leading-tight">Top Symbol</p>
              </div>
              <div className="flex justify-center mt-2 flex-shrink-0">
                <Badge className="bg-yellow-500/20 text-yellow-300 text-sm sm:text-xs px-2 py-1">44%</Badge>
              </div>
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
                  placeholder="Describe your dream in detail... What did you see, feel, or experience? Please provide at least 100 characters for a meaningful interpretation."
                  value={dream}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setDream(e.target.value)
                    }
                  }}
                  maxLength={500}
                  className="min-h-24 sm:min-h-32 bg-white/5 border-white/10 resize-none"
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-0">
                  <p className={`text-base ${
                    dream.length < 100 
                      ? 'text-red-400' 
                      : dream.length >= 450 
                        ? 'text-yellow-400' 
                        : 'text-gray-400'
                  }`}>
                    {dream.length}/500 characters {dream.length < 100 ? `(${100 - dream.length} more needed)` : ''}
                  </p>
                  <Button
                    size="sm"
                    onClick={analyzeDream}
                    disabled={isAnalyzing || dream.trim().length < 100}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
              {interpretation && (() => {
                const content = interpretation.content;
                const sections = content.split(/\*\*(.+?)\*\*/g);

                return (
                  <GlassCard glow className="p-4 sm:p-6">
                    <DreamInterpretation 
                      title={interpretation.title}
                      content={content}
                      showTitle={true}
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-white/10">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={saveDreamToJournal}
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-300 hover:text-green-200 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-300 mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Save to Journal
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToPage("/readings")}
                        className="w-full sm:w-auto bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/30 text-pink-300 hover:text-pink-200"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get Tarot Reading
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigateToPage("/insights")}
                        className="w-full sm:w-auto bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300 hover:text-blue-200"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Patterns
                      </Button>
                    </div>
                  </GlassCard>
                );
              })()}

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
