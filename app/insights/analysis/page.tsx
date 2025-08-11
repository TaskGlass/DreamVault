"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Brain, TrendingUp, Star, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

// Helper functions to generate meaningful analysis data
const generateSymbolMeaning = (symbol: string): string => {
  const meanings: Record<string, string> = {
    'water': 'Represents the flow of emotions, intuition, and the unconscious mind. Water can be calm (emotional peace) or turbulent (emotional turmoil), reflecting your current emotional state and how you navigate life\'s currents.',
    'flying': 'Symbolizes liberation from constraints, elevated consciousness, and the ability to rise above challenges. Flying dreams often indicate spiritual growth, breaking free from limiting beliefs, or gaining new perspectives on life situations.',
    'house': 'Represents your psyche, sense of self, and personal foundation. Different rooms may represent different aspects of your personality, while the condition of the house reflects your current state of mind and emotional well-being.',
    'car': 'Symbolizes your life journey, direction, and how you navigate challenges. Being in the driver\'s seat suggests taking control, while being a passenger may indicate feeling powerless or letting others direct your path.',
    'stairs': 'Represents personal growth, spiritual ascension, and the step-by-step process of development. Going up suggests progress and achievement, while going down may indicate exploring deeper aspects of yourself or past experiences.',
    'mirror': 'Symbolizes self-reflection, truth, and the need to examine your authentic self. Mirrors often appear when you need to face reality, understand your true feelings, or recognize aspects of yourself you may have been avoiding.',
    'door': 'Represents opportunities, choices, and transitions in life. Open doors suggest new possibilities and growth, while closed doors may indicate missed opportunities, barriers, or the need to make important decisions.',
    'window': 'Symbolizes perspective, insight, and new ways of looking at situations. Windows suggest gaining clarity, seeing things differently, or receiving revelations that can change your understanding of current circumstances.',
    'tree': 'Represents growth, stability, and connection to your roots and natural wisdom. Trees often appear during periods of personal development, suggesting you\'re establishing a strong foundation for future growth.',
    'moon': 'Symbolizes intuition, feminine energy, emotional cycles, and the mysterious aspects of consciousness. The moon often appears when you need to trust your instincts, embrace your emotional nature, or work with lunar energy.',
    'sun': 'Represents consciousness, vitality, masculine energy, and the illuminating power of awareness. The sun suggests clarity of thought, renewed energy, or the need to bring light to dark areas of your life.',
    'stars': 'Symbolize guidance, hope, spiritual connection, and divine inspiration. Stars often appear when you\'re seeking direction, need reassurance, or are connecting with higher wisdom and spiritual guidance.',
    'ocean': 'Represents the vast unconscious mind, deep emotions, and the mystery of your inner world. The ocean suggests exploring profound aspects of yourself, processing deep feelings, or connecting with universal consciousness.',
    'mountain': 'Symbolizes challenges, goals, spiritual elevation, and the journey toward achievement. Mountains represent obstacles to overcome, personal growth to achieve, or the need to rise above current limitations.',
    'bridge': 'Represents transitions, connections between different aspects of life, and overcoming obstacles. Bridges suggest moving from one phase to another, connecting different parts of yourself, or finding ways to cross difficult situations.',
    'fire': 'Symbolizes transformation, passion, purification, and the power of change. Fire represents burning away what no longer serves you, igniting new passions, or the transformative energy needed for personal growth.',
    'earth': 'Represents grounding, stability, material concerns, and connection to the physical world. Earth suggests the need to stay grounded, focus on practical matters, or find stability in your current situation.',
    'air': 'Symbolizes thoughts, communication, mental clarity, and intellectual processes. Air represents the realm of ideas, the need for clear thinking, or the importance of effective communication in your life.',
    'animals': 'Represent instincts, primal nature, spiritual guides, and aspects of your personality. Different animals carry specific meanings - predators may represent assertiveness, while gentle animals may suggest nurturing qualities.',
    'people': 'Symbolize aspects of yourself, relationships, or archetypal energies. People in dreams often represent different parts of your personality, unresolved relationships, or qualities you admire or need to develop.',
  }
  return meanings[symbol.toLowerCase()] || `"${symbol}" represents a unique symbol in your personal dream language. This element holds special meaning for you that may not be found in traditional dream dictionaries. Consider what this symbol evokes in your mind, how it makes you feel, and what personal associations you have with it. Your subconscious is using this symbol to communicate something specific about your current life situation, emotions, or spiritual journey.`
}

const generateSymbolInterpretation = (symbol: string, frequency: number, totalDreams: number): string => {
  const percentage = Math.round((frequency / totalDreams) * 100)
  
  if (percentage > 50) {
    return `This symbol is highly significant in your dream life, appearing in ${percentage}% of your dreams. Its frequent presence suggests it represents a core aspect of your psyche or life situation that requires immediate attention. This symbol is trying to communicate something fundamental about your current life journey, emotional state, or spiritual development. Consider it a primary message from your subconscious that deserves deep reflection and integration into your waking life.`
  } else if (percentage > 25) {
    return `This symbol appears regularly in your dreams (${percentage}%), indicating it holds moderate significance and represents ongoing themes or patterns in your life. While not as dominant as your primary symbols, it still carries important messages about aspects of your personality, relationships, or life circumstances that are currently active. This symbol may represent areas where you're experiencing growth, challenges, or the need for attention.`
  } else if (percentage > 10) {
    return `This symbol appears occasionally in your dreams (${percentage}%), suggesting it represents specific situations, emotions, or life events rather than core life themes. It may appear during particular periods of stress, change, or when you're processing specific experiences. While not a constant presence, this symbol can provide valuable insights when it does appear, offering guidance for particular circumstances or decisions.`
  } else {
    return `This symbol appears rarely in your dreams (${percentage}%), making it a special messenger that appears when you need specific guidance or insight. Its infrequent appearance suggests it represents unique situations, rare opportunities, or special messages from your subconscious. When this symbol appears, pay close attention to the context and timing, as it may be bringing important information for a particular moment or decision in your life.`
  }
}

const generatePsychologicalMeaning = (symbol: string): string => {
  const meanings: Record<string, string> = {
    'water': 'Psychologically, water represents your emotional state and unconscious mind. Clear water suggests emotional clarity and inner peace, while murky water may indicate unresolved feelings, emotional confusion, or the need to process difficult experiences. The depth and movement of water can reveal how you handle emotional currents in your life.',
    'flying': 'Flying in dreams often represents freedom from psychological constraints, elevated thinking, or a desire to escape current limitations in your waking life. This symbol suggests you\'re developing higher consciousness, breaking free from limiting beliefs, or gaining new perspectives that allow you to rise above challenges.',
    'house': 'Houses in dreams represent your psyche and sense of self. Different rooms may represent different aspects of your personality or life areas. The condition of the house reflects your current psychological state - a well-maintained house suggests inner harmony, while a damaged house may indicate unresolved issues or emotional wounds.',
    'car': 'Cars represent your life direction and how you navigate psychological challenges. Being in the driver\'s seat suggests taking control of your thoughts and emotions, while being a passenger may indicate feeling powerless over your mental state or letting external factors control your inner world.',
    'stairs': 'Stairs represent psychological progress and personal development. Going up suggests growth in self-awareness and emotional maturity, while going down may indicate exploring deeper aspects of yourself, confronting subconscious patterns, or revisiting past experiences for healing.',
    'mirror': 'Mirrors represent self-reflection and psychological truth. They often appear when you need to examine your true feelings, face uncomfortable realities, or recognize aspects of yourself you may have been avoiding. This symbol suggests a period of self-examination and psychological growth.',
    'door': 'Doors represent psychological opportunities and choices. Open doors suggest new possibilities for personal growth and emotional development, while closed doors may indicate psychological barriers, missed opportunities for healing, or the need to make important decisions about your inner world.',
    'window': 'Windows represent psychological perspective and insight. They suggest looking at your thoughts and emotions from different angles, gaining new understanding of yourself, or receiving psychological revelations that can change your self-perception.',
    'tree': 'Trees represent psychological growth, stability, and connection to your emotional roots. They often appear during periods of personal development, suggesting you\'re establishing a strong psychological foundation for future growth and emotional resilience.',
    'moon': 'The moon represents intuition, emotions, and feminine energy in your psychological landscape. It often appears when you need to trust your instincts, embrace your emotional nature, or work with the cyclical nature of your psychological processes.',
  }
  return meanings[symbol.toLowerCase()] || `From a psychological perspective, "${symbol}" may represent aspects of your personality, emotions, or life experiences that are currently active in your psyche. Consider how this symbol makes you feel, what memories it evokes, and how it relates to your current psychological state. This symbol may be highlighting areas where you need psychological attention, growth, or healing.`
}

const generateSpiritualMeaning = (symbol: string): string => {
  const meanings: Record<string, string> = {
    'water': 'Spiritually, water represents purification, emotional healing, and the flow of divine energy. It often appears during spiritual awakening, emotional cleansing, or when you\'re connecting with your intuitive nature. Water symbolizes the fluidity of spiritual growth and the need to flow with divine timing rather than forcing outcomes.',
    'flying': 'Flying represents spiritual elevation, freedom from earthly concerns, and connection to higher consciousness. This symbol suggests you\'re experiencing spiritual growth, developing your spiritual gifts, or receiving divine guidance that allows you to transcend current limitations. It may indicate a period of spiritual expansion and connection to your higher self.',
    'house': 'Houses represent your spiritual foundation and the temple of your soul. They often appear during spiritual development, suggesting you\'re building a strong spiritual base. The condition of the house reflects your spiritual state - a beautiful, well-lit house suggests spiritual harmony, while a dark or damaged house may indicate areas of spiritual growth needed.',
    'car': 'Cars represent your spiritual journey and how you navigate your spiritual path. The condition of the car reflects your spiritual state - a well-maintained car suggests spiritual clarity and direction, while a damaged car may indicate spiritual obstacles or the need for spiritual maintenance and renewal.',
    'stairs': 'Stairs represent spiritual ascension and the path to higher consciousness. Each step represents a level of spiritual understanding and growth. This symbol suggests you\'re progressing on your spiritual path, gaining new insights, or moving toward higher levels of spiritual awareness and enlightenment.',
    'mirror': 'Mirrors represent spiritual reflection and the search for divine truth. They often appear when you need to examine your spiritual beliefs, practices, or when receiving spiritual revelations. This symbol suggests a period of spiritual self-examination and the need to align your outer life with your inner spiritual truth.',
    'door': 'Doors represent spiritual opportunities and divine guidance. They may indicate new spiritual paths opening, spiritual teachings coming into your life, or the need to make spiritual choices. Open doors suggest divine invitations, while closed doors may indicate spiritual lessons to learn before proceeding.',
    'window': 'Windows represent spiritual insight and divine revelation. They suggest receiving spiritual wisdom, gaining new spiritual perspectives, or experiencing spiritual breakthroughs. This symbol indicates that divine light and understanding are available to you if you remain open and receptive.',
    'tree': 'Trees represent spiritual growth, wisdom, and connection to divine wisdom and natural cycles. They often appear during spiritual development, suggesting you\'re establishing deep spiritual roots and growing toward spiritual maturity. Trees symbolize the connection between heaven and earth, spirit and matter.',
    'moon': 'The moon represents divine feminine energy, intuition, and spiritual cycles. It often appears during spiritual awakening, suggesting you\'re developing your intuitive gifts and connecting with lunar energy. The moon symbolizes the mysterious aspects of spirituality and the need to trust your spiritual instincts.',
  }
  return meanings[symbol.toLowerCase()] || `Spiritually, "${symbol}" may represent divine guidance, spiritual lessons, or messages from your higher self. This symbol could be a sign from the universe, a spiritual teacher, or your own soul trying to communicate important spiritual insights. Pay attention to how this symbol appears, what feelings it evokes, and what spiritual messages it brings. Consider meditating on this symbol to receive deeper spiritual understanding.`
}

const generateActionableInsights = (symbol: string): string[] => {
  const insights: Record<string, string[]> = {
    'water': [
      'Practice emotional awareness through daily journaling and meditation',
      'Engage in water-based activities like swimming, walking by water, or taking baths',
      'Explore your feelings about current life situations through therapy or self-reflection',
      'Practice emotional flow by allowing feelings to come and go without resistance',
      'Consider using water sounds (rain, ocean waves) for meditation and relaxation'
    ],
    'flying': [
      'Identify specific limitations in your life that you want to overcome',
      'Practice visualization exercises for freedom and expansion daily',
      'Consider what would make you feel more liberated in your current situation',
      'Work on breaking free from limiting beliefs through affirmations and mindset work',
      'Explore activities that give you a sense of freedom (dancing, hiking, creative expression)'
    ],
    'house': [
      'Examine your living space and how it reflects your inner state - declutter and organize',
      'Consider which rooms feel comfortable vs. uncomfortable and why',
      'Reflect on your sense of security and foundation in life',
      'Create a sacred space in your home for meditation and reflection',
      'Work on making your living environment more aligned with your inner peace'
    ],
    'car': [
      'Assess your current life direction and whether it aligns with your true goals',
      'Identify what obstacles are blocking your progress and create action plans',
      'Reflect on whether you feel in control of your journey or being driven by others',
      'Create a roadmap for where you want to go and how to get there',
      'Practice being more intentional about the direction you\'re heading in life'
    ],
    'stairs': [
      'Identify specific areas where you want to grow or improve',
      'Break down big goals into smaller, manageable steps with timelines',
      'Celebrate your progress and achievements, no matter how small',
      'Create a step-by-step plan for personal development in your chosen areas',
      'Practice patience and persistence as you climb toward your goals'
    ],
    'mirror': [
      'Practice daily self-reflection and honest self-assessment',
      'Examine areas of your life where you may be avoiding truth',
      'Work on accepting and loving all aspects of yourself',
      'Consider what you see when you look at yourself honestly',
      'Practice mirror work - looking into your own eyes and speaking positive affirmations'
    ],
    'door': [
      'Identify new opportunities that may be opening in your life',
      'Consider what doors you may need to close to move forward',
      'Practice making decisions about which paths to take',
      'Be open to unexpected opportunities that may present themselves',
      'Work on being more decisive about your life choices'
    ],
    'window': [
      'Practice looking at situations from different perspectives',
      'Seek new viewpoints and insights from others',
      'Be open to revelations and new understanding',
      'Practice gaining clarity on confusing situations',
      'Consider what new insights you need in your current life'
    ],
    'tree': [
      'Focus on establishing strong roots in your personal and professional life',
      'Practice patience and allow yourself to grow at your own pace',
      'Connect with nature regularly to strengthen your natural wisdom',
      'Work on building a solid foundation for future growth',
      'Consider what areas of your life need more stability and grounding'
    ],
    'moon': [
      'Practice working with lunar cycles and moon phases',
      'Develop your intuitive abilities through meditation and mindfulness',
      'Embrace your emotional nature and feminine energy',
      'Practice trusting your instincts and inner knowing',
      'Consider how you can better align with natural cycles and rhythms'
    ]
  }
  return insights[symbol.toLowerCase()] || [
    'Reflect on what this symbol means to you personally and journal about it',
    'Consider how it appears in your waking life and what it might be telling you',
    'Practice meditation on this symbol to receive deeper insights',
    'Research traditional meanings of this symbol in various cultures and traditions',
    'Create a personal connection with this symbol through art, writing, or ritual'
  ]
}

const generateEmotionTrend = (emotion: string, dreams: any[]): string => {
  if (dreams.length < 3) return 'stable'
  
  // Simple trend analysis based on recent dreams
  const recentDreams = dreams.slice(0, 3)
  const emotionCount = recentDreams.filter(d => d.mood === emotion).length
  
  if (emotionCount >= 2) return 'increasing'
  if (emotionCount === 0) return 'decreasing'
  return 'stable'
}

const generateEmotionAnalysis = (emotion: string, frequency: number, totalDreams: number): string => {
  const percentage = Math.round((frequency / totalDreams) * 100)
  
  const analyses: Record<string, string> = {
    'Peaceful': `Peaceful dreams appear in ${percentage}% of your dreams, indicating a generally calm and content state of mind. This suggests you're experiencing inner harmony and emotional balance.`,
    'Anxious': `Anxiety appears in ${percentage}% of your dreams, suggesting you may be processing stress or worry. This is common during challenging life transitions or when facing uncertainty.`,
    'Curious': `Curiosity appears in ${percentage}% of your dreams, indicating an open and exploratory mindset. This suggests you're in a learning phase or seeking new experiences.`,
    'Hopeful': `Hope appears in ${percentage}% of your dreams, showing optimism about your future. This suggests you're in a positive mindset and looking forward to what's ahead.`,
    'Confused': `Confusion appears in ${percentage}% of your dreams, indicating uncertainty about current situations. This suggests you may need clarity or direction in some area of your life.`
  }
  
  return analyses[emotion] || `This emotion appears in ${percentage}% of your dreams, suggesting it's a significant part of your current emotional landscape. Consider what situations or thoughts might be triggering this feeling.`
}

const generateEmotionRecommendations = (emotion: string): string[] => {
  const recommendations: Record<string, string[]> = {
    'Peaceful': [
      'Maintain your current practices that bring inner peace',
      'Share your sense of calm with others who may need support',
      'Use this peaceful energy for creative or spiritual pursuits'
    ],
    'Anxious': [
      'Practice stress-reduction techniques like deep breathing',
      'Identify the source of your anxiety and address it directly',
      'Consider talking to a trusted friend or professional'
    ],
    'Curious': [
      'Embrace new learning opportunities and experiences',
      'Ask questions and explore topics that interest you',
      'Use this curiosity to expand your knowledge and skills'
    ],
    'Hopeful': [
      'Channel this optimism into action toward your goals',
      'Share your positive outlook with others',
      'Use this energy to plan and work toward your dreams'
    ],
    'Confused': [
      'Take time to clarify your thoughts and feelings',
      'Seek information or guidance on unclear situations',
      'Break down complex issues into smaller, manageable parts'
    ]
  }
  
  return recommendations[emotion] || [
    'Reflect on what this emotion is telling you',
    'Consider how to work with this feeling constructively',
    'Journal about your experiences with this emotion'
  ]
}

const generateDreamThemes = (dreams: any[]): any[] => {
  if (dreams.length === 0) return []
  
  const themes = []
  
  // Analyze common themes based on dream content
  const hasWater = dreams.some(d => d.symbols?.some((s: string) => s.toLowerCase().includes('water') || s.toLowerCase().includes('ocean') || s.toLowerCase().includes('river')))
  const hasFlying = dreams.some(d => d.symbols?.some((s: string) => s.toLowerCase().includes('flying') || s.toLowerCase().includes('wings') || s.toLowerCase().includes('air')))
  const hasNature = dreams.some(d => d.symbols?.some((s: string) => s.toLowerCase().includes('tree') || s.toLowerCase().includes('mountain') || s.toLowerCase().includes('earth')))
  const hasPeople = dreams.some(d => d.symbols?.some((s: string) => s.toLowerCase().includes('person') || s.toLowerCase().includes('people') || s.toLowerCase().includes('family')))
  
  if (hasWater) {
    themes.push({
      theme: 'Water & Emotions',
      description: 'Your dreams frequently feature water elements, suggesting you\'re processing deep emotions and intuitive insights.',
      examples: ['Ocean waves', 'Rivers flowing', 'Rain falling', 'Swimming'],
      significance: 'Water represents your emotional landscape and unconscious mind. These dreams may indicate emotional healing, intuition development, or processing of feelings.'
    })
  }
  
  if (hasFlying) {
    themes.push({
      theme: 'Freedom & Transcendence',
      description: 'Flying dreams suggest you\'re seeking freedom from limitations and exploring higher consciousness.',
      examples: ['Soaring through clouds', 'Flying over landscapes', 'Floating weightlessly', 'Wings spreading'],
      significance: 'These dreams indicate spiritual growth, breaking free from constraints, and expanding your perspective on life.'
    })
  }
  
  if (hasNature) {
    themes.push({
      theme: 'Natural Connection',
      description: 'Nature elements in your dreams suggest a strong connection to the earth and natural cycles.',
      examples: ['Trees growing', 'Mountains rising', 'Earth grounding', 'Seasons changing'],
      significance: 'This theme represents your connection to natural wisdom, growth cycles, and finding stability in life\'s changes.'
    })
  }
  
  if (hasPeople) {
    themes.push({
      theme: 'Relationships & Social',
      description: 'People in your dreams often represent aspects of yourself or important relationships.',
      examples: ['Family members', 'Friends', 'Strangers', 'Groups of people'],
      significance: 'These dreams help you understand your social connections, personal boundaries, and how you relate to others.'
    })
  }
  
  // Add a general theme if no specific themes were identified
  if (themes.length === 0) {
    themes.push({
      theme: 'Personal Growth',
      description: 'Your dreams are unique to your personal journey and experiences.',
      examples: ['Individual symbols', 'Personal memories', 'Unique scenarios', 'Custom meanings'],
      significance: 'Each dream is a personal message from your subconscious, offering insights specific to your life path and growth.'
    })
  }
  
  return themes
}

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
        meaning: generateSymbolMeaning(symbol),
        interpretation: generateSymbolInterpretation(symbol, frequency, dreams.length),
        psychologicalMeaning: generatePsychologicalMeaning(symbol),
        spiritualMeaning: generateSpiritualMeaning(symbol),
        actionableInsights: generateActionableInsights(symbol),
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
        trend: generateEmotionTrend(emotion, dreams),
        analysis: generateEmotionAnalysis(emotion, frequency, dreams.length),
        recommendations: generateEmotionRecommendations(emotion),
      }))
      setEmotionalPatterns(emotionArr)
      
      // Dream themes based on actual dream content
      const themes = generateDreamThemes(dreams)
      setDreamThemes(themes)
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
                <div className="text-3xl font-bold text-purple-300">{stats.total}</div>
                <p className="text-sm text-gray-400">Dreams Analyzed</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                <div className="text-3xl font-bold text-green-300">{stats.uniqueSymbols}</div>
                <p className="text-sm text-gray-400">Unique Symbols</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl">
                <div className="text-3xl font-bold text-pink-300">{stats.uniqueEmotions}</div>
                <p className="text-sm text-gray-400">Emotional Themes</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6">
              <h3 className="font-semibold text-purple-300 mb-3">Key Insights</h3>
              {dreams.length > 0 ? (
                <>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {symbolAnalysis.length > 0 && emotionalPatterns.length > 0 ? (
                      `Your dream patterns reveal ${symbolAnalysis.length > 3 ? 'a rich tapestry of' : 'distinct'} symbolic language with ${symbolAnalysis.length} unique symbols appearing across your dreams. The most frequent symbol "${symbolAnalysis[0]?.symbol || 'unknown'}" appears in ${symbolAnalysis[0]?.percentage || 0}% of your dreams, suggesting it holds particular significance for your subconscious mind.`
                    ) : (
                      'Your dream journal is beginning to reveal patterns that can offer valuable insights into your inner world.'
                    )}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {emotionalPatterns.length > 0 ? (
                      `Your emotional landscape shows ${emotionalPatterns[0]?.emotion || 'various'} as the predominant feeling, appearing in ${emotionalPatterns[0]?.percentage || 0}% of your dreams. This suggests your subconscious is processing ${emotionalPatterns[0]?.emotion === 'Peaceful' ? 'inner peace and contentment' : emotionalPatterns[0]?.emotion === 'Anxious' ? 'anxiety and stress' : emotionalPatterns[0]?.emotion === 'Curious' ? 'curiosity and exploration' : emotionalPatterns[0]?.emotion === 'Hopeful' ? 'hope and optimism' : 'emotional themes'} that deserve your attention.`
                    ) : (
                      'As you continue to record your dreams, you\'ll discover deeper emotional patterns and their meanings.'
                    )}
                  </p>
                </>
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  Start recording your dreams to unlock personalized insights into your subconscious patterns and emotional landscape.
                </p>
              )}
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
                    <h3 className="text-xl font-semibold text-purple-300 flex-1 mr-4">{symbol.symbol}</h3>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge className="bg-purple-500/20 whitespace-nowrap">{symbol.frequency} times</Badge>
                      <Badge className="bg-blue-500/20 whitespace-nowrap">{symbol.percentage}%</Badge>
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
                    {symbolAnalysis.length > 0 && (
                      <li>• Focus on understanding your recurring symbol: {symbolAnalysis[0]?.symbol}</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-green-300 mb-2">Emotional Integration</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Practice meditation for emotional clarity</li>
                    <li>• Engage in creative expression</li>
                    <li>• Spend time in nature</li>
                    <li>• Consider therapy for deeper exploration</li>
                    {emotionalPatterns.length > 0 && emotionalPatterns[0]?.emotion === 'Anxious' && (
                      <li>• Focus on stress-reduction techniques for anxiety</li>
                    )}
                    {emotionalPatterns.length > 0 && emotionalPatterns[0]?.emotion === 'Peaceful' && (
                      <li>• Channel your peaceful energy into helping others</li>
                    )}
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
                    {dreamThemes.length > 0 && dreamThemes[0]?.theme.includes('Water') && (
                      <li>• Explore water-based spiritual practices</li>
                    )}
                    {dreamThemes.length > 0 && dreamThemes[0]?.theme.includes('Flying') && (
                      <li>• Practice visualization for spiritual elevation</li>
                    )}
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl">
                  <h3 className="font-semibold text-pink-300 mb-2">Personal Growth</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Embrace change and new opportunities</li>
                    <li>• Trust your intuition in decision-making</li>
                    <li>• Pursue activities that bring joy and freedom</li>
                    <li>• Share your insights with others</li>
                    {dreams.length > 0 && (
                      <li>• Continue recording your {dreams.length} dream{symbolAnalysis.length > 1 ? 's' : ''} for deeper insights</li>
                    )}
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
