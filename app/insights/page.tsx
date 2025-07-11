"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Calendar, Heart, Moon, Zap, Eye, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const router = useRouter()
  const [dreams, setDreams] = useState<any[]>([])
  const [moodData, setMoodData] = useState<any[]>([])
  const [symbolData, setSymbolData] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, dominantMood: '', topSymbol: '', topSymbolPercentage: 0 })

  useEffect(() => {
    const fetchDreams = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
      setDreams(dreams || [])
      // Mood analysis
      const moodCounts: Record<string, number> = {}
      const symbolCounts: Record<string, number> = {}
      const weekMap: Record<string, { dreams: number; mood: string }> = {}
      dreams?.forEach(d => {
        if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
        if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
        // Weekly grouping
        const week = new Date(d.date)
        const weekNum = `${week.getFullYear()}-W${Math.ceil((week.getDate() + 6 - week.getDay()) / 7)}`
        if (!weekMap[weekNum]) weekMap[weekNum] = { dreams: 0, mood: d.mood }
        weekMap[weekNum].dreams++
      })
      // Prepare mood data
      const moodArr = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        color: '', // Optionally map to color
        percentage: dreams && dreams.length > 0 ? Math.round((count / dreams.length) * 100) : 0,
      }))
      setMoodData(moodArr)
      // Prepare symbol data
      const symbolArr = Object.entries(symbolCounts).map(([symbol, count]) => ({
        symbol,
        count,
        meaning: '', // Optionally use OpenAI or a lookup for meaning
      }))
      setSymbolData(symbolArr)
      // Prepare weekly data
      const weekArr = Object.entries(weekMap).map(([week, { dreams, mood }]) => ({
        week,
        dreams,
        mood,
      }))
      setWeeklyData(weekArr)
      // Stats
      const dominantMood = moodArr.sort((a, b) => b.count - a.count)[0]?.mood || ''
      const topSymbolData = symbolArr.sort((a, b) => b.count - a.count)[0]
      const rawTopSymbol = topSymbolData?.symbol || ''
      // Truncate top symbol to 1-2 words max
      const topSymbol = rawTopSymbol.split(' ').slice(0, 2).join(' ')
      const topSymbolPercentage = topSymbolData && dreams && dreams.length > 0 
        ? Math.round((topSymbolData.count / dreams.length) * 100) 
        : 0
      setStats({ total: dreams?.length || 0, dominantMood, topSymbol, topSymbolPercentage })
    }
    fetchDreams()
  }, [timeRange])

  const navigateToTechniques = () => {
    router.push("/techniques")
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-glow flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-purple-400" />
                Dream Insights
              </h1>
              <p className="text-gray-400 mt-1">Discover patterns in your subconscious mind</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">
                  <span className="sm:hidden">Week</span>
                  <span className="hidden sm:inline">This Week</span>
                </SelectItem>
                <SelectItem value="month">
                  <span className="sm:hidden">Month</span>
                  <span className="hidden sm:inline">This Month</span>
                </SelectItem>
                <SelectItem value="year">
                  <span className="sm:hidden">Year</span>
                  <span className="hidden sm:inline">This Year</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center">
              <Moon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Dreams</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">+12%</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center">
              <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">3.5</p>
              <p className="text-sm text-gray-400">Dreams/Week</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-xs text-green-400">+8%</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center">
              <Heart className="h-8 w-8 text-pink-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{stats.dominantMood}</p>
              <p className="text-sm text-gray-400">Dominant Mood</p>
              <Badge className="mt-2 bg-blue-500/20 text-blue-300 text-xs">35%</Badge>
            </GlassCard>

            <GlassCard className="text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <p className="text-2xl font-bold">{stats.topSymbol}</p>
              <p className="text-sm text-gray-400">Top Symbol</p>
              <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 text-xs">
                {stats.topSymbolPercentage || 0}%
              </Badge>
            </GlassCard>
          </div>

          {/* Mood Analysis */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-400" />
              Emotional Patterns
            </h2>

            <div className="space-y-4">
              {moodData.map((mood, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{mood.mood}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{mood.count} dreams</span>
                      <Badge variant="outline" className="text-xs">
                        {mood.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div
                      className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${mood.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl">
              <h3 className="font-semibold text-pink-300 mb-2">Emotional Insight</h3>
              <p className="text-sm text-gray-300">
                Your dreams show a predominantly peaceful state of mind, suggesting inner harmony and emotional balance.
                The presence of curiosity indicates an active subconscious exploring new possibilities.
              </p>
            </div>
          </GlassCard>

          {/* Symbol Analysis */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-400" />
              Recurring Symbols
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {symbolData.map((symbol, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <h3 className="font-medium">{symbol.symbol}</h3>
                      <p className="text-sm text-gray-400">{symbol.meaning}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-300">{symbol.count}</p>
                      <p className="text-xs text-gray-400">times</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-green-300 mb-2">Symbol Interpretation</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Flying appears most frequently in your dreams, indicating a strong desire for freedom and personal
                    growth. Water symbols suggest you're processing deep emotions.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => router.push("/insights/analysis")}>
                    View Full Analysis
                  </Button>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
                  <h3 className="font-semibold text-purple-300 mb-2">Spiritual Guidance</h3>
                  <p className="text-sm text-gray-300">
                    Your subconscious is guiding you toward liberation and emotional clarity. Trust your instincts as
                    you navigate life's journey.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Weekly Trends */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Dream Activity Trends
            </h2>

            <div className="space-y-4">
              {weeklyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mr-4">
                      <span className="text-sm font-bold">{week.dreams}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{week.week}</h3>
                      <p className="text-sm text-gray-400">{week.dreams} dreams recorded</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {week.mood}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => router.push("/insights/timeline")}>
                <Calendar className="h-4 w-4 mr-2" />
                View Detailed Timeline
              </Button>
            </div>
          </GlassCard>

          {/* Recommendations */}
          <GlassCard glow>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Personalized Recommendations
            </h2>

            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl text-center">
                <h3 className="font-semibold text-yellow-300 mb-3">Dream Enhancement</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Based on your peaceful dream patterns, try lucid dreaming techniques to enhance your spiritual journey
                  and gain deeper insights into your subconscious mind.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={navigateToTechniques}>
                  Learn Techniques
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
