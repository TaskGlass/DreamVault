"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Moon, TrendingUp, Heart, Eye, Clock, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout"

export default function TimelinePage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("week")
  const [selectedMood, setSelectedMood] = useState("all")
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [weeklyStats, setWeeklyStats] = useState<any[]>([])

  // Initialize inactivity timeout (3 minutes)
  useInactivityTimeout(3)

  const moodColors = {
    Peaceful: "bg-blue-500/20 text-blue-300",
    Confused: "bg-orange-500/20 text-orange-300",
    Curious: "bg-green-500/20 text-green-300",
    Anxious: "bg-red-500/20 text-red-300",
    Hopeful: "bg-purple-500/20 text-purple-300",
  }

  // Fallback for intensityColors if not defined
  const intensityColors: Record<string, string> = {
    Low: "bg-green-500/20 text-green-300",
    Medium: "bg-yellow-500/20 text-yellow-300",
    High: "bg-red-500/20 text-red-300",
  }

  useEffect(() => {
    const fetchTimeline = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      // Group dreams by date
      const grouped: Record<string, any> = {}
      dreams?.forEach(dream => {
        const date = dream.date
        if (!grouped[date]) grouped[date] = { date, day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }), dreams: [] }
        grouped[date].dreams.push(dream)
      })
      setTimelineData(Object.values(grouped))
      // Weekly stats
      const weekMap: Record<string, { totalDreams: number; moods: Record<string, number>; lucidDreams: number; symbols: Record<string, number> }> = {}
      dreams?.forEach(dream => {
        const date = new Date(dream.date)
        const weekNum = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`
        if (!weekMap[weekNum]) weekMap[weekNum] = { totalDreams: 0, moods: {}, lucidDreams: 0, symbols: {} }
        weekMap[weekNum].totalDreams++
        if (dream.mood) weekMap[weekNum].moods[dream.mood] = (weekMap[weekNum].moods[dream.mood] || 0) + 1
        if (dream.lucidity) weekMap[weekNum].lucidDreams++
        if (dream.symbols) dream.symbols.forEach((s: string) => weekMap[weekNum].symbols[s] = (weekMap[weekNum].symbols[s] || 0) + 1)
      })
      const weeklyArr = Object.entries(weekMap).map(([week, stats]) => {
        const avgMood = Object.entries(stats.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const topSymbol = Object.entries(stats.symbols).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        return { week, totalDreams: stats.totalDreams, avgMood, lucidDreams: stats.lucidDreams, topSymbol }
      })
      setWeeklyStats(weeklyArr)
    }
    fetchTimeline()
  }, [])

  const filteredData = timelineData.filter((day: any) => {
    if (selectedMood === "all") return true
    return day.dreams.some((dream: any) => dream.mood === selectedMood)
  })

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-glow flex items-center">
                <Calendar className="h-6 w-6 mr-2 text-purple-400" />
                Dream Timeline
              </h1>
              <p className="text-gray-400 mt-1">Detailed chronological view of your dream journey</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  <SelectItem value="Peaceful">Peaceful</SelectItem>
                  <SelectItem value="Curious">Curious</SelectItem>
                  <SelectItem value="Anxious">Anxious</SelectItem>
                  <SelectItem value="Hopeful">Hopeful</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weekly Summary */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Weekly Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyStats.map((week, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl">
                  <h3 className="font-medium text-purple-300 mb-3 text-sm leading-tight">{week.week}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Dreams:</span>
                      <span className="text-sm font-medium">{week.totalDreams}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Avg Mood:</span>
                      <Badge className={`${moodColors[String(week.avgMood) as keyof typeof moodColors]}/20 text-xs`}>{week.avgMood}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Lucid:</span>
                      <span className="text-sm font-medium">{week.lucidDreams}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Top Symbol:</span>
                      <span className="text-sm font-medium text-yellow-300">{week.topSymbol}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredData.map((day, dayIndex) => (
              <GlassCard key={dayIndex}>
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-300" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg leading-tight">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {day.dreams.length} dream{day.dreams.length !== 1 ? "s" : ""} recorded
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {day.dreams.map((dream: any, dreamIndex: number) => (
                    <div key={dreamIndex} className="p-4 bg-white/5 rounded-xl border-l-4 border-purple-500/50">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-medium text-purple-300">{dream.title}</h4>
                            {dream.lucidity && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 text-xs self-start">Lucid</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">{dream.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={`${moodColors[String(dream.mood) as keyof typeof moodColors]}/20 text-xs`}>
                          <Heart className="h-3 w-3 mr-1" />
                          {dream.mood}
                        </Badge>
                        <Badge className={`${intensityColors[String(dream.intensity) as keyof typeof intensityColors]}/20 text-xs`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {dream.intensity}
                        </Badge>
                        <Badge className="bg-gray-500/20 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {dream.duration}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {dream.symbols && dream.symbols.map((symbol: any, symbolIndex: number) => (
                          <Badge key={symbolIndex} variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Insights */}
          <GlassCard glow>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Moon className="h-5 w-5 mr-2 text-blue-400" />
              Timeline Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                  <h3 className="font-semibold text-blue-300 mb-2">Dream Frequency Pattern</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    You're averaging 3.5 dreams per week, with higher activity on weekends. This suggests your
                    subconscious is most active when you're relaxed and have fewer daily stresses.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-green-300 mb-2">Lucid Dream Progress</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your lucid dreaming frequency is increasing, with 25% of recent dreams being lucid. This indicates
                    growing self-awareness and dream control abilities.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
                  <h3 className="font-semibold text-purple-300 mb-2">Emotional Evolution</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Your dream emotions show a positive trend, with peaceful and hopeful dreams increasing while anxious
                    dreams decrease. This reflects your growing inner harmony.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl">
                  <h3 className="font-semibold text-yellow-300 mb-2">Symbol Consistency</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Flying and water symbols appear consistently across your timeline, indicating core themes of freedom
                    and emotional processing that your subconscious is actively working with.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
