"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Brain, TrendingUp, Star, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AnalysisPage() {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("symbols")
  const [dreams, setDreams] = useState<any[]>([])
  const [symbolAnalysis, setSymbolAnalysis] = useState<any[]>([])
  const [emotionalPatterns, setEmotionalPatterns] = useState<any[]>([])
  const [dreamThemes, setDreamThemes] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, uniqueSymbols: 0, uniqueEmotions: 0 })

  useEffect(() => {
    const fetchAnalysis = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
      setDreams(dreams || [])
      // Symbol analysis
      const symbolCounts: Record<string, number> = {}
      dreams?.forEach(d => {
        if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
      })
      const symbolArr = Object.entries(symbolCounts).map(([symbol, frequency]) => ({
        symbol,
        frequency,
        percentage: dreams && dreams.length > 0 ? Math.round((frequency / dreams.length) * 100) : 0,
        meaning: '', // Optionally use OpenAI or a lookup for meaning
        interpretation: '',
        psychologicalMeaning: '',
        spiritualMeaning: '',
        actionableInsights: [],
      }))
      setSymbolAnalysis(symbolArr)
      // Emotional patterns
      const emotionCounts: Record<string, number> = {}
      dreams?.forEach(d => {
        if (d.mood) emotionCounts[d.mood] = (emotionCounts[d.mood] || 0) + 1
      })
      const emotionArr = Object.entries(emotionCounts).map(([emotion, frequency]) => ({
        emotion,
        frequency,
        percentage: dreams && dreams.length > 0 ? Math.round((frequency / dreams.length) * 100) : 0,
        trend: '',
        analysis: '',
        recommendations: [],
      }))
      setEmotionalPatterns(emotionArr)
      // Dream themes (placeholder: could use OpenAI or custom logic)
      setDreamThemes([])
      // Stats
      setStats({
        total: dreams?.length || 0,
        uniqueSymbols: symbolArr.length,
        uniqueEmotions: emotionArr.length,
      })
    }
    fetchAnalysis()
  }, [])

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
          <div>
            <h1 className="text-2xl font-bold text-glow flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-400" />
              Full Dream Analysis
            </h1>
            <p className="text-gray-400 mt-1">Deep insights into your subconscious patterns</p>
          </div>

          {/* Analysis Overview */}
          <GlassCard glow>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-green-400" />
              Analysis Summary
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl">
                <div className="text-3xl font-bold text-purple-300">34</div>
                <p className="text-sm text-gray-400">Dreams Analyzed</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                <div className="text-3xl font-bold text-green-300">15</div>
                <p className="text-sm text-gray-400">Unique Symbols</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl">
                <div className="text-3xl font-bold text-pink-300">8</div>
                <p className="text-sm text-gray-400">Emotional Themes</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6">
              <h3 className="font-semibold text-purple-300 mb-3">Key Insights</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your dream patterns reveal a soul in transition, actively seeking growth and spiritual connection. The
                predominance of flying and water symbols indicates you're processing both the desire for freedom and
                deep emotional healing. Your subconscious is guiding you toward a more authentic, liberated version of
                yourself.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The decreasing anxiety patterns and increasing peaceful emotions show remarkable progress in your
                personal development journey. Trust this process and continue embracing the changes your dreams are
                encouraging.
              </p>
            </div>
          </GlassCard>

          {/* Tab Navigation */}
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 w-full">
            <Button
              variant={selectedTab === "symbols" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab("symbols")}
              className={`flex-1 px-2 py-2 rounded-lg transition-all text-xs sm:text-sm ${
                selectedTab === "symbols"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="sm:hidden">Symbols</span>
              <span className="hidden sm:inline">Symbol Analysis</span>
            </Button>
            <Button
              variant={selectedTab === "emotions" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab("emotions")}
              className={`flex-1 px-2 py-2 rounded-lg transition-all text-xs sm:text-sm ${
                selectedTab === "emotions"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="sm:hidden">Emotions</span>
              <span className="hidden sm:inline">Emotional Patterns</span>
            </Button>
            <Button
              variant={selectedTab === "themes" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTab("themes")}
              className={`flex-1 px-2 py-2 rounded-lg transition-all text-xs sm:text-sm ${
                selectedTab === "themes"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="sm:hidden">Themes</span>
              <span className="hidden sm:inline">Dream Themes</span>
            </Button>
          </div>

          {/* Symbol Analysis Tab */}
          {selectedTab === "symbols" && (
            <div className="space-y-6">
              {symbolAnalysis.map((symbol, index) => (
                <GlassCard key={index}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-300">{symbol.symbol}</h3>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-500/20">{symbol.frequency} times</Badge>
                      <Badge className="bg-blue-500/20">{symbol.percentage}%</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-yellow-300 mb-2">Core Meaning</h4>
                        <p className="text-gray-300 text-sm">{symbol.meaning}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-green-300 mb-2">Interpretation</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{symbol.interpretation}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-blue-300 mb-2">Psychological Meaning</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{symbol.psychologicalMeaning}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-pink-300 mb-2">Spiritual Significance</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">{symbol.spiritualMeaning}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-orange-300 mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Actionable Insights
                        </h4>
                        <ul className="space-y-1">
                          {symbol.actionableInsights.map((insight, i) => (
                            <li key={i} className="text-gray-300 text-sm flex items-start">
                              <span className="text-orange-400 mr-2">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Emotional Patterns Tab */}
          {selectedTab === "emotions" && (
            <div className="space-y-6">
              {emotionalPatterns.map((emotion, index) => (
                <GlassCard key={index}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-300">{emotion.emotion}</h3>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-purple-500/20">{emotion.frequency} dreams</Badge>
                      <Badge className="bg-blue-500/20">{emotion.percentage}%</Badge>
                      <Badge
                        className={`${
                          emotion.trend === "increasing"
                            ? "bg-green-500/20 text-green-300"
                            : emotion.trend === "decreasing"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {emotion.trend === "increasing" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {emotion.trend}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-white/5 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${emotion.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-yellow-300 mb-2">Analysis</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{emotion.analysis}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-300 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Recommendations
                      </h4>
                      <ul className="space-y-1">
                        {emotion.recommendations.map((rec, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Dream Themes Tab */}
          {selectedTab === "themes" && (
            <div className="space-y-6">
              {dreamThemes.map((theme, index) => (
                <GlassCard key={index}>
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">{theme.theme}</h3>

                  <p className="text-gray-300 leading-relaxed mb-4">{theme.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-300 mb-2">Common Examples</h4>
                      <ul className="space-y-1">
                        {theme.examples.map((example, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center">
                            <span className="text-blue-400 mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-300 mb-2">Significance</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{theme.significance}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Recommendations */}
          <GlassCard glow>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Personalized Recommendations
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-purple-300 mb-2">Dream Enhancement Practices</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Keep a dream journal by your bedside</li>
                    <li>• Practice lucid dreaming techniques</li>
                    <li>• Set intentions before sleep</li>
                    <li>• Create a peaceful sleep environment</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-green-300 mb-2">Emotional Integration</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Practice meditation for emotional clarity</li>
                    <li>• Engage in creative expression</li>
                    <li>• Spend time in nature</li>
                    <li>• Consider therapy for deeper exploration</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl">
                  <h3 className="font-semibold text-yellow-300 mb-2">Spiritual Development</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Explore meditation and mindfulness</li>
                    <li>• Study dream symbolism and mythology</li>
                    <li>• Connect with like-minded spiritual communities</li>
                    <li>• Practice gratitude and affirmations</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl">
                  <h3 className="font-semibold text-pink-300 mb-2">Personal Growth</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Embrace change and new opportunities</li>
                    <li>• Trust your intuition in decision-making</li>
                    <li>• Pursue activities that bring joy and freedom</li>
                    <li>• Share your insights with others</li>
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
