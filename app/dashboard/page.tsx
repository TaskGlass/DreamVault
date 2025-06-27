"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"

const recentDreams = [
  {
    id: 1,
    title: "Flying Over the Ocean",
    date: "2024-01-15",
    mood: "Peaceful",
    symbols: ["Water", "Flying", "Freedom"],
  },
  {
    id: 2,
    title: "Lost in a Maze",
    date: "2024-01-12",
    mood: "Confused",
    symbols: ["Maze", "Lost", "Searching"],
  },
  {
    id: 3,
    title: "Talking to Animals",
    date: "2024-01-10",
    mood: "Curious",
    symbols: ["Animals", "Communication", "Nature"],
  },
]

const moodColors = {
  Peaceful: "bg-blue-500/20 text-blue-300",
  Confused: "bg-orange-500/20 text-orange-300",
  Curious: "bg-green-500/20 text-green-300",
  Anxious: "bg-red-500/20 text-red-300",
  Hopeful: "bg-purple-500/20 text-purple-300",
}

export default function DashboardPage() {
  // Remove the apiKeyMissing state and related code since the API key is now configured
  const [dream, setDream] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [interpretation, setInterpretation] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-glow">
                {getGreeting()}, <span className="text-4xl">Luna ✨</span>
              </h1>
              <p className="text-gray-400 mt-1 text-base">Welcome back to your dream sanctuary</p>
            </div>
          </div>

          {/* API Key Warning */}
          {/* Remove the API Key Warning section from the JSX since it's no longer needed */}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center">
              <BookOpen className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">23</p>
              <p className="text-base text-gray-400">Total Dreams</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+3 this week</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center">
              <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">7</p>
              <p className="text-base text-gray-400">This Month</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+12%</span>
              </div>
            </GlassCard>

            <GlassCard className="text-center">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">Peaceful</p>
              <p className="text-base text-gray-400">Top Mood</p>
              <Badge className="mt-1 bg-blue-500/20 text-blue-300 text-xs">35%</Badge>
            </GlassCard>

            <GlassCard className="text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold">Flying</p>
              <p className="text-base text-gray-400">Top Symbol</p>
              <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 text-xs">44%</Badge>
            </GlassCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dream Input */}
              <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Stars className="h-5 w-5 mr-2 text-purple-400" />
                  Share Your Dream
                </h2>
                <Textarea
                  placeholder="Describe your dream in detail... What did you see, feel, or experience?"
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  className="min-h-32 bg-white/5 border-white/10 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <p className="text-base text-gray-400">{dream.length}/500 characters</p>
                  <Button
                    size="sm"
                    onClick={analyzeDream}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
                <GlassCard glow>
                  <h2 className="text-2xl font-semibold mb-4 text-purple-300">{interpretation.title}</h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dream Summary</h3>
                      <p className="text-base text-gray-300 whitespace-pre-wrap">{interpretation.summary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" variant="outline" onClick={() => navigateToPage("/journal")}>
                        Save to Journal
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => navigateToPage("/readings")}>
                        Get Tarot Reading
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Quick Actions */}
              <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20"
                    onClick={() => navigateToPage("/journal")}
                  >
                    <Plus className="h-6 w-6 mb-1 text-purple-400" />
                    <span className="text-sm">New Entry</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20"
                    onClick={() => navigateToPage("/insights")}
                  >
                    <BarChart3 className="h-6 w-6 mb-1 text-blue-400" />
                    <span className="text-sm">View Insights</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20"
                    onClick={() => navigateToPage("/readings")}
                  >
                    <Shuffle className="h-6 w-6 mb-1 text-pink-400" />
                    <span className="text-sm">Tarot Reading</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 border-white/20"
                    onClick={() => navigateToPage("/readings")}
                  >
                    <Eye className="h-6 w-6 mb-1 text-green-400" />
                    <span className="text-sm">Affirmations</span>
                  </Button>
                </div>
              </GlassCard>

              {/* Recent Dreams */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                    Recent Dreams
                  </h2>
                  <Link href="/journal" scroll={true}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1 md:text-sm md:px-3 md:py-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
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
                      className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <div>
                        <h3 className="text-lg font-medium">{dream.title}</h3>
                        <p className="text-base text-gray-400">{new Date(dream.date).toLocaleDateString()}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dream.symbols.slice(0, 2).map((symbol, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge className={moodColors[dream.mood as keyof typeof moodColors] || "bg-gray-500/20"}>
                        {dream.mood}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Daily Horoscope */}
              <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Today's Horoscope
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-4xl mr-3">♌</div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-300">Leo</h3>
                        <p className="text-base text-gray-400">
                          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300">★★★★☆</Badge>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/10 to-slate-500/10 rounded-lg p-4">
                    <p className="text-base text-gray-300 leading-relaxed mb-3">
                      Today brings powerful cosmic energy that aligns perfectly with your dream work. The moon's
                      position enhances your intuitive abilities, making this an excellent time for dream interpretation
                      and spiritual reflection.
                    </p>
                    <p className="text-base text-gray-300 leading-relaxed">
                      Pay special attention to water symbols in your dreams today - they carry important messages about
                      emotional healing and transformation.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Lucky Element</p>
                      <p className="text-base font-medium text-purple-300">Fire</p>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Dream Focus</p>
                      <p className="text-base font-medium text-blue-300">Water</p>
                    </div>
                  </div>

                  <Link href="/readings" scroll={true}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 mt-8"
                      onClick={() => navigateToPage("/readings")}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Full Reading
                    </Button>
                  </Link>
                </div>
              </GlassCard>

              {/* Subscription Status */}
              <GlassCard>
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
                      <span className="text-base">Interpretations & Tarot Readings</span>
                      <span className="text-base font-medium">3/5</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-sm text-gray-400 mt-1">
                      2 interpretations & tarot readings remaining this month
                    </p>
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
              <GlassCard>
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-400" />
                  Daily Affirmation
                </h2>
                <div className="text-center py-4">
                  <div className="text-3xl mb-3">✨</div>
                  <blockquote className="text-base font-medium text-purple-300 mb-3">
                    "I trust my inner wisdom and embrace the messages my dreams bring to my conscious mind."
                  </blockquote>
                  <Link href="/readings" scroll={true}>
                    <Button size="sm" variant="outline" onClick={() => navigateToPage("/readings")}>
                      More Affirmations
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
