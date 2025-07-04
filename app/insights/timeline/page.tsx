"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Moon, TrendingUp, Heart, Eye, Clock, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

const timelineData = [
  {
    date: "2024-01-15",
    day: "Monday",
    dreams: [
      {
        title: "Flying Over Mountains",
        mood: "Peaceful",
        symbols: ["Flying", "Mountains", "Sky"],
        intensity: "High",
        lucidity: false,
        duration: "Long",
        description: "Soaring above snow-capped peaks with a sense of complete freedom and joy.",
      },
    ],
  },
  {
    date: "2024-01-14",
    day: "Sunday",
    dreams: [
      {
        title: "Ocean Waves",
        mood: "Curious",
        symbols: ["Water", "Ocean", "Waves"],
        intensity: "Medium",
        lucidity: false,
        duration: "Medium",
        description: "Standing on a beach watching powerful waves crash, feeling both awe and uncertainty.",
      },
      {
        title: "Talking Animals",
        mood: "Hopeful",
        symbols: ["Animals", "Communication", "Forest"],
        intensity: "Medium",
        lucidity: true,
        duration: "Short",
        description: "Conversing with wise forest animals who shared guidance about life decisions.",
      },
    ],
  },
  {
    date: "2024-01-13",
    day: "Saturday",
    dreams: [
      {
        title: "Maze of Light",
        mood: "Anxious",
        symbols: ["Maze", "Light", "Paths"],
        intensity: "High",
        lucidity: false,
        duration: "Long",
        description: "Navigating through a complex maze with beams of light showing the way forward.",
      },
    ],
  },
  {
    date: "2024-01-12",
    day: "Friday",
    dreams: [
      {
        title: "Underwater City",
        mood: "Peaceful",
        symbols: ["Water", "City", "Fish"],
        intensity: "Medium",
        lucidity: false,
        duration: "Medium",
        description: "Exploring a beautiful underwater civilization with crystal clear water and colorful marine life.",
      },
    ],
  },
  {
    date: "2024-01-11",
    day: "Thursday",
    dreams: [
      {
        title: "Flying with Birds",
        mood: "Curious",
        symbols: ["Flying", "Birds", "Sky"],
        intensity: "High",
        lucidity: true,
        duration: "Long",
        description: "Joining a flock of birds in flight, learning their patterns and communication.",
      },
    ],
  },
  {
    date: "2024-01-10",
    day: "Wednesday",
    dreams: [
      {
        title: "Garden of Memories",
        mood: "Hopeful",
        symbols: ["Garden", "Flowers", "Past"],
        intensity: "Low",
        lucidity: false,
        duration: "Short",
        description: "Walking through a garden where each flower represented a cherished memory.",
      },
    ],
  },
  {
    date: "2024-01-09",
    day: "Tuesday",
    dreams: [
      {
        title: "Storm at Sea",
        mood: "Anxious",
        symbols: ["Water", "Storm", "Ship"],
        intensity: "High",
        lucidity: false,
        duration: "Medium",
        description: "Navigating a ship through turbulent waters during a fierce storm.",
      },
    ],
  },
  {
    date: "2024-01-08",
    day: "Monday",
    dreams: [
      {
        title: "Mountain Climbing",
        mood: "Peaceful",
        symbols: ["Mountains", "Climbing", "Achievement"],
        intensity: "Medium",
        lucidity: false,
        duration: "Long",
        description: "Steadily climbing a mountain with determination, reaching the summit at sunrise.",
      },
    ],
  },
]

const weeklyStats = [
  { week: "Week 1 (Jan 8-14)", totalDreams: 8, avgMood: "Peaceful", lucidDreams: 2, topSymbol: "Flying" },
  { week: "Week 2 (Jan 1-7)", totalDreams: 6, avgMood: "Curious", lucidDreams: 1, topSymbol: "Water" },
  { week: "Week 3 (Dec 25-31)", totalDreams: 5, avgMood: "Hopeful", lucidDreams: 0, topSymbol: "Animals" },
  { week: "Week 4 (Dec 18-24)", totalDreams: 7, avgMood: "Peaceful", lucidDreams: 3, topSymbol: "Light" },
]

const moodColors = {
  Peaceful: "bg-blue-500",
  Curious: "bg-green-500",
  Anxious: "bg-red-500",
  Hopeful: "bg-purple-500",
  Confused: "bg-orange-500",
}

const intensityColors = {
  Low: "bg-gray-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
}

export default function TimelinePage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("week")
  const [selectedMood, setSelectedMood] = useState("all")

  const filteredData = timelineData.filter((day) => {
    if (selectedMood === "all") return true
    return day.dreams.some((dream) => dream.mood === selectedMood)
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
                      <Badge className={`${moodColors[week.avgMood]}/20 text-xs`}>{week.avgMood}</Badge>
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
                  {day.dreams.map((dream, dreamIndex) => (
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
                        <Badge className={`${moodColors[dream.mood]}/20 text-xs`}>
                          <Heart className="h-3 w-3 mr-1" />
                          {dream.mood}
                        </Badge>
                        <Badge className={`${intensityColors[dream.intensity]}/20 text-xs`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {dream.intensity}
                        </Badge>
                        <Badge className="bg-gray-500/20 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {dream.duration}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {dream.symbols.map((symbol, symbolIndex) => (
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
