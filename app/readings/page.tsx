"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Moon, Star, Shuffle, Eye, Heart, X } from "lucide-react"
import { createPortal } from "react-dom"
import { supabase } from "@/lib/supabaseClient"

const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity", image: "🃏" },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, power", image: "🎩" },
  { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine", image: "🌙" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, abundance", image: "👑" },
  { name: "The Emperor", meaning: "Authority, establishment, structure", image: "⚡" },
  { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment", image: "💕" },
]

// Helper functions for zodiac data
const getZodiacInfo = (zodiacSign: string) => {
  const zodiacData: Record<string, any> = {
    "Aries": { symbol: "♈", element: "Fire", rulingPlanet: "Mars" },
    "Taurus": { symbol: "♉", element: "Earth", rulingPlanet: "Venus" },
    "Gemini": { symbol: "♊", element: "Air", rulingPlanet: "Mercury" },
    "Cancer": { symbol: "♋", element: "Water", rulingPlanet: "Moon" },
    "Leo": { symbol: "♌", element: "Fire", rulingPlanet: "Sun" },
    "Virgo": { symbol: "♍", element: "Earth", rulingPlanet: "Mercury" },
    "Libra": { symbol: "♎", element: "Air", rulingPlanet: "Venus" },
    "Scorpio": { symbol: "♏", element: "Water", rulingPlanet: "Mars" },
    "Sagittarius": { symbol: "♐", element: "Fire", rulingPlanet: "Jupiter" },
    "Capricorn": { symbol: "♑", element: "Earth", rulingPlanet: "Saturn" },
    "Aquarius": { symbol: "♒", element: "Air", rulingPlanet: "Uranus" },
    "Pisces": { symbol: "♓", element: "Water", rulingPlanet: "Neptune" }
  }
  return zodiacData[zodiacSign] || { symbol: "⭐", element: "Universal", rulingPlanet: "Cosmos" }
}

const generateLuckyNumbers = (zodiacSign: string) => {
  const zodiacIndex = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].indexOf(zodiacSign)
  const base = zodiacIndex + 1
  return [base, base + 7, base + 14, base + 21].filter(n => n <= 31)
}

const getBestTime = (zodiacSign: string) => {
  const times: Record<string, string> = {
    "Aries": "6:00 AM - 8:00 AM",
    "Taurus": "8:00 AM - 10:00 AM", 
    "Gemini": "10:00 AM - 12:00 PM",
    "Cancer": "12:00 PM - 2:00 PM",
    "Leo": "11:00 AM - 1:00 PM",
    "Virgo": "2:00 PM - 4:00 PM",
    "Libra": "4:00 PM - 6:00 PM",
    "Scorpio": "6:00 PM - 8:00 PM",
    "Sagittarius": "8:00 PM - 10:00 PM",
    "Capricorn": "10:00 PM - 12:00 AM",
    "Aquarius": "12:00 AM - 2:00 AM",
    "Pisces": "2:00 AM - 4:00 AM"
  }
  return times[zodiacSign] || "Anytime"
}

const getDreamSymbols = (zodiacSign: string) => {
  const symbols: Record<string, string[]> = {
    "Aries": ["Fire", "Mountains", "Warriors", "Red objects", "Rams"],
    "Taurus": ["Nature", "Gardens", "Bulls", "Green landscapes", "Flowers"],
    "Gemini": ["Birds", "Messages", "Twins", "Books", "Communication"],
    "Cancer": ["Water", "Moon", "Shells", "Home", "Family"],
    "Leo": ["Sun", "Lions", "Gold", "Stages", "Crowns"],
    "Virgo": ["Healing", "Organization", "Earth", "Service", "Perfection"],
    "Libra": ["Balance", "Partnerships", "Art", "Justice", "Harmony"],
    "Scorpio": ["Transformation", "Depth", "Mysteries", "Phoenix", "Intensity"],
    "Sagittarius": ["Adventure", "Arrows", "Travel", "Wisdom", "Freedom"],
    "Capricorn": ["Mountains", "Achievement", "Structure", "Discipline", "Success"],
    "Aquarius": ["Innovation", "Groups", "Future", "Electricity", "Humanitarian"],
    "Pisces": ["Ocean", "Fish", "Spirituality", "Dreams", "Compassion"]
  }
  return symbols[zodiacSign] || ["Universal symbols", "Cosmic energy", "Spiritual growth"]
}

const zodiacSigns = [
  {
    name: "Aries",
    dates: "Mar 21 - Apr 19",
    element: "Fire",
    symbol: "♈",
    horoscope:
      "Your fiery energy is at its peak today. Channel this passion into creative projects and don't be afraid to take the lead. Dreams may reveal hidden ambitions waiting to be pursued.",
    dreamGuidance:
      "Fire signs often dream of conquest and adventure. Pay attention to dreams involving mountains, flames, or battles - they represent your inner warrior awakening.",
  },
  {
    name: "Taurus",
    dates: "Apr 20 - May 20",
    element: "Earth",
    symbol: "♉",
    horoscope:
      "Stability and comfort are your focus now. Trust your practical instincts and pay attention to dreams about nature or material security. A steady approach will yield the best results.",
    dreamGuidance:
      "Earth signs dream of nature and material security. Gardens, trees, and fertile lands in your dreams symbolize growth and abundance coming your way.",
  },
  {
    name: "Gemini",
    dates: "May 21 - Jun 20",
    element: "Air",
    symbol: "♊",
    horoscope:
      "Communication flows freely today. Your dreams may be filled with conversations and messages. Stay curious and open to new information that could change your perspective.",
    dreamGuidance:
      "Air signs often dream of flight and communication. Dreams with birds, wind, or conversations indicate important messages from your subconscious.",
  },
  {
    name: "Cancer",
    dates: "Jun 21 - Jul 22",
    element: "Water",
    symbol: "♋",
    horoscope:
      "Your intuition is heightened, especially regarding family and home matters. Dreams about water or childhood memories carry important emotional messages. Trust your feelings.",
    dreamGuidance:
      "Water signs dream deeply of emotions and memories. Ocean waves, rain, or childhood scenes in dreams indicate emotional healing and intuitive insights.",
  },
  {
    name: "Leo",
    dates: "Jul 23 - Aug 22",
    element: "Fire",
    symbol: "♌",
    horoscope:
      "The spotlight is on you today. Your creative energy shines bright, and dreams may feature themes of performance or recognition. Embrace your natural leadership qualities.",
    dreamGuidance:
      "Fire signs dream of glory and creativity. Dreams with stages, spotlights, or golden objects represent your inner desire to shine and inspire others.",
  },
  {
    name: "Virgo",
    dates: "Aug 23 - Sep 22",
    element: "Earth",
    symbol: "♍",
    horoscope:
      "Attention to detail serves you well. Dreams may focus on organization, health, or service to others. Your analytical mind can solve problems that have been puzzling you.",
    dreamGuidance:
      "Earth signs dream of order and service. Dreams involving cleaning, organizing, or helping others indicate your soul's desire to bring healing to the world.",
  },
  {
    name: "Libra",
    dates: "Sep 23 - Oct 22",
    element: "Air",
    symbol: "♎",
    horoscope:
      "Balance and harmony are key themes. Dreams about relationships or artistic pursuits carry special significance. Seek beauty and fairness in all your interactions today.",
    dreamGuidance:
      "Air signs dream of balance and relationships. Dreams with mirrors, partnerships, or beautiful art reflect your desire for harmony and connection.",
  },
  {
    name: "Scorpio",
    dates: "Oct 23 - Nov 21",
    element: "Water",
    symbol: "♏",
    horoscope:
      "Deep transformation is occurring beneath the surface. Pay attention to intense dreams or recurring symbols. Your psychic abilities are particularly strong right now.",
    dreamGuidance:
      "Water signs dream of transformation and mystery. Dreams involving caves, underground spaces, or phoenix imagery indicate profound spiritual rebirth.",
  },
  {
    name: "Sagittarius",
    dates: "Nov 22 - Dec 21",
    element: "Fire",
    symbol: "♐",
    horoscope:
      "Adventure calls to your spirit. Dreams of distant places or philosophical insights point toward expansion. Your optimism can inspire others to reach for their dreams too.",
    dreamGuidance:
      "Fire signs dream of adventure and wisdom. Dreams with arrows, distant lands, or wise teachers represent your quest for truth and meaning.",
  },
  {
    name: "Capricorn",
    dates: "Dec 22 - Jan 19",
    element: "Earth",
    symbol: "♑",
    horoscope:
      "Ambition and discipline guide your path. Dreams about climbing mountains or achieving goals reflect your inner drive. Patience and persistence will lead to success.",
    dreamGuidance:
      "Earth signs dream of achievement and structure. Dreams involving climbing, building, or reaching summits indicate your path to mastery and success.",
  },
  {
    name: "Aquarius",
    dates: "Jan 20 - Feb 18",
    element: "Air",
    symbol: "♒",
    horoscope:
      "Innovation and friendship are highlighted. Dreams may feature futuristic themes or group activities. Your unique perspective can bring positive change to your community.",
    dreamGuidance:
      "Air signs dream of the future and humanity. Dreams with flying machines, groups of people, or futuristic scenes indicate your role as a visionary.",
  },
  {
    name: "Pisces",
    dates: "Feb 19 - Mar 20",
    element: "Water",
    symbol: "♓",
    horoscope:
      "Your psychic sensitivity is at its peak. Dreams are especially vivid and meaningful now. Trust your intuition and pay attention to synchronicities in your waking life.",
    dreamGuidance:
      "Water signs dream of the mystical and spiritual. Dreams with fish, vast oceans, or ethereal beings indicate your connection to divine wisdom and universal love.",
  },
]

function ZodiacModal({ zodiac, onClose }: { zodiac: any; onClose: () => void }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const modalContent = (
    <div
      className="fixed inset-0 w-screen h-screen bg-black backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      }}
    >
      <GlassCard className="max-w-md w-full relative" glow>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{zodiac.symbol}</div>
          <h3 className="text-2xl font-bold text-purple-300 mb-1">{zodiac.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{zodiac.dates}</p>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20">{zodiac.element} Sign</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-yellow-300 mb-2 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Today's Horoscope
            </h4>
            <p className="text-gray-300 leading-relaxed text-sm">{zodiac.horoscope}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4">
            <h5 className="font-medium text-purple-300 mb-2">Dream Guidance</h5>
            <p className="text-xs text-gray-300">{zodiac.dreamGuidance}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )

  // Render modal at the root level using a portal
  return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null
}

export default function ReadingsPage() {
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentHoroscope, setCurrentHoroscope] = useState<any>(null)
  const [selectedZodiac, setSelectedZodiac] = useState<any>(null)
  const [userZodiac, setUserZodiac] = useState<string>("")
  const [todaysHoroscope, setTodaysHoroscope] = useState<string>("")
  const [loadingHoroscope, setLoadingHoroscope] = useState(false)
  const [horoscopeData, setHoroscopeData] = useState<any>(null)
  const [todaysAffirmation, setTodaysAffirmation] = useState<string>("")
  const [loadingAffirmation, setLoadingAffirmation] = useState(false)
  const [todaysMoonPhase, setTodaysMoonPhase] = useState<string>("")
  const [loadingMoonPhase, setLoadingMoonPhase] = useState(false)

  const tarotRef = useRef<HTMLDivElement>(null)
  const horoscopeRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const affirmationRef = useRef<HTMLDivElement>(null)

  // Add this useEffect after the existing state declarations
  useEffect(() => {
    // Check if user came from dashboard wanting to see horoscope
    const showHoroscope = sessionStorage.getItem("showHoroscope")
    if (showHoroscope) {
      sessionStorage.removeItem("showHoroscope")
      setTimeout(() => {
        horoscopeRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [])

  // Load horoscope when userZodiac is available
  useEffect(() => {
    if (userZodiac) {
      getHoroscope()
    }
  }, [userZodiac])

  useEffect(() => {
    const fetchUserZodiac = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('zodiac')
        .eq('id', user.id)
        .single()
      setUserZodiac(profile?.zodiac || "")
    }
    fetchUserZodiac()
  }, [])

  const fetchHoroscope = async () => {
    if (!userZodiac) return
    setLoadingHoroscope(true)
    const today = new Date().toISOString().slice(0, 10)
    // Check if horoscope already exists in Supabase
    const { data: existing } = await supabase
      .from('horoscopes')
      .select('content')
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
      .eq('zodiac', userZodiac)
      .eq('date', today)
      .single()
    if (existing?.content) {
      setTodaysHoroscope(existing.content)
      setLoadingHoroscope(false)
      return
    }
    // Generate with OpenAI
    const response = await fetch('/api/generate-horoscope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zodiac: userZodiac })
    })
    const { horoscope } = await response.json()
    setTodaysHoroscope(horoscope)
    // Store in Supabase
    await supabase.from('horoscopes').insert([
      {
        user_id: (await supabase.auth.getUser()).data.user.id,
        zodiac: userZodiac,
        date: today,
        content: horoscope,
      },
    ])
    setLoadingHoroscope(false)
  }

  const drawTarotCards = () => {
    setIsDrawing(true)
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
      setSelectedCards(shuffled.slice(0, 3))
      setIsDrawing(false)
    }, 2000)
  }

  const getHoroscope = async () => {
    if (!userZodiac) return
    
    setLoadingHoroscope(true)
    try {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      
      const response = await fetch('/api/daily-horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          zodiacSign: userZodiac,
          userId: user.id 
        })
      })
      
      const result = await response.json()
      if (result.horoscope) {
        setHoroscopeData(result)
        setTodaysHoroscope(result.horoscope)
        
        // Set the current horoscope with user's actual data
        const zodiacInfo = getZodiacInfo(userZodiac)
        setCurrentHoroscope({
          sign: userZodiac,
          date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          symbol: zodiacInfo.symbol,
          element: zodiacInfo.element,
          rulingPlanet: zodiacInfo.rulingPlanet,
          reading: result.horoscope,
          love: "Your romantic energy is enhanced by today's cosmic alignment. Trust your intuition in matters of the heart.",
          career: "Professional opportunities may present themselves today. Your natural abilities shine in collaborative settings.", 
          health: "Focus on balance and listen to your body's wisdom. Gentle movement and mindful breathing support your wellbeing.",
          lucky: result.luckyElement,
          luckyNumbers: generateLuckyNumbers(userZodiac),
          bestTime: getBestTime(userZodiac),
          moonPhase: "Current lunar phase supports your spiritual growth",
          planetaryInfluence: `${zodiacInfo.rulingPlanet} influences bring enhanced clarity and focus to your path.`,
          dreamSymbols: getDreamSymbols(userZodiac),
          advice: `Trust your ${zodiacInfo.element.toLowerCase()} nature today. Pay attention to dreams featuring ${result.dreamFocus.toLowerCase()} elements - they carry important messages for your spiritual journey.`,
        })
      }
    } catch (error) {
      console.error('Error fetching horoscope:', error)
    } finally {
      setLoadingHoroscope(false)
    }
  }

  const fetchAffirmation = async () => {
    setLoadingAffirmation(true)
    const today = new Date().toISOString().slice(0, 10)
    const { data: existing } = await supabase
      .from('affirmations')
      .select('content')
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
      .eq('date', today)
      .single()
    if (existing?.content) {
      setTodaysAffirmation(existing.content)
      setLoadingAffirmation(false)
      return
    }
    const response = await fetch('/api/generate-affirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zodiac: userZodiac })
    })
    const { affirmation } = await response.json()
    setTodaysAffirmation(affirmation)
    await supabase.from('affirmations').insert([
      {
        user_id: (await supabase.auth.getUser()).data.user.id,
        date: today,
        content: affirmation,
      },
    ])
    setLoadingAffirmation(false)
  }

  const fetchMoonPhase = async () => {
    setLoadingMoonPhase(true)
    const today = new Date().toISOString().slice(0, 10)
    const { data: existing } = await supabase
      .from('moon_phases')
      .select('content')
      .eq('date', today)
      .single()
    if (existing?.content) {
      setTodaysMoonPhase(existing.content)
      setLoadingMoonPhase(false)
      return
    }
    const response = await fetch('/api/generate-moon-phase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: today })
    })
    const { moonPhase } = await response.json()
    setTodaysMoonPhase(moonPhase)
    await supabase.from('moon_phases').insert([
      {
        date: today,
        content: moonPhase,
      },
    ])
    setLoadingMoonPhase(false)
  }

  const scrollToTarot = () => {
    drawTarotCards()
    setTimeout(() => {
      tarotRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const scrollToHoroscope = async () => {
    if (userZodiac && !currentHoroscope) {
      await getHoroscope()
    }
    horoscopeRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToMoon = () => {
    moonRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToAffirmation = () => {
    affirmationRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
                <Sparkles className="h-12 w-12 text-purple-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-glow mb-2">Mystical Readings</h1>
            <p className="text-gray-300 max-w-md mx-auto">
              Discover deeper insights through tarot, horoscopes, and spiritual guidance
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center cursor-pointer hover:glow transition-all" onClick={scrollToTarot}>
              <Shuffle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="font-medium">Draw Cards</p>
              <p className="text-xs text-gray-400">3-Card Spread</p>
            </GlassCard>
            <GlassCard className="text-center cursor-pointer hover:glow transition-all" onClick={scrollToHoroscope}>
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="font-medium">Horoscope</p>
              <p className="text-xs text-gray-400">Daily Reading</p>
            </GlassCard>
            <GlassCard className="text-center cursor-pointer hover:glow transition-all" onClick={scrollToMoon}>
              <Moon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="font-medium">Moon Phase</p>
              <p className="text-xs text-gray-400">Current Energy</p>
            </GlassCard>
            <GlassCard className="text-center cursor-pointer hover:glow transition-all" onClick={scrollToAffirmation}>
              <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="font-medium">Affirmation</p>
              <p className="text-xs text-gray-400">Daily Wisdom</p>
            </GlassCard>
          </div>

          {/* Tarot Reading */}
          <GlassCard ref={tarotRef}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shuffle className="h-5 w-5 mr-2 text-purple-400" />
              Tarot Reading
            </h2>

            {selectedCards.length === 0 && !isDrawing ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔮</div>
                <p className="text-gray-400 mb-6">
                  Draw three cards to receive guidance about your dreams and life path
                </p>
                <Button
                  onClick={drawTarotCards}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Draw Cards
                </Button>
              </div>
            ) : isDrawing ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">🔮</div>
                <p className="text-gray-400">The cards are being drawn...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedCards.map((card, index) => (
                    <GlassCard key={index} className="text-center" glow>
                      <div className="text-4xl mb-3">{card.image}</div>
                      <h3 className="font-semibold text-purple-300 mb-2">{card.name}</h3>
                      <p className="text-sm text-gray-300">{card.meaning}</p>
                      <Badge className="mt-3 bg-purple-500/20">
                        {index === 0 ? "Past" : index === 1 ? "Present" : "Future"}
                      </Badge>
                    </GlassCard>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-3 text-purple-300">Reading Interpretation</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your three-card spread reveals a journey of transformation. The past shows foundations being laid,
                    the present indicates a time of decision and action, while the future promises growth and new
                    opportunities. Trust in your intuition as you navigate the path ahead.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button onClick={drawTarotCards} variant="outline">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Draw New Cards
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Horoscope */}
          <GlassCard ref={horoscopeRef} glow>
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-400" />
              Your Horoscope
            </h2>

            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{currentHoroscope?.symbol}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-300">{currentHoroscope?.sign}</h3>
                    <p className="text-sm text-gray-400">{currentHoroscope?.date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-orange-500/20 text-orange-300">{currentHoroscope?.element} Sign</Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-300">
                        Ruled by {currentHoroscope?.rulingPlanet}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Reading */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-300 mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Daily Overview
                </h4>
                {loadingHoroscope ? (
                  <p className="text-gray-300 leading-relaxed">Loading your personalized horoscope...</p>
                ) : todaysHoroscope ? (
                  (() => {
                    const parts = todaysHoroscope.split('\n\nCosmic tip:')
                    const mainReading = parts[0]
                    const cosmicTip = parts[1]
                    
                    return (
                      <div className="space-y-4">
                        <p className="text-gray-300 leading-relaxed">
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
                  <p className="text-gray-300 leading-relaxed">Your daily horoscope will appear here.</p>
                )}
              </div>

              {/* Life Areas Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-pink-300 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Love & Relationships
                  </h5>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{currentHoroscope?.love}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-green-300 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Career & Finance
                  </h5>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{currentHoroscope?.career}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-blue-300 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Health & Wellness
                  </h5>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{currentHoroscope?.health}</p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-purple-300 mb-3">Lucky Elements</h5>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Color:</span>
                      <span className="text-yellow-300">{currentHoroscope?.lucky}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Numbers:</span>
                      <span className="text-yellow-300">{currentHoroscope?.luckyNumbers?.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Best Time:</span>
                      <span className="text-yellow-300">{currentHoroscope?.bestTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-indigo-300 mb-3">Cosmic Influences</h5>
                  <div className="space-y-2 text-sm md:text-base">
                    <div>
                      <span className="text-gray-400">Moon Phase:</span>
                      <p className="text-indigo-300 text-xs md:text-sm">{currentHoroscope?.moonPhase}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Planetary Energy:</span>
                      <p className="text-indigo-300 text-xs md:text-sm">{currentHoroscope?.planetaryInfluence}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dream Guidance */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6">
                <h5 className="font-medium text-purple-300 mb-3 flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Dream Symbols to Watch For
                </h5>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentHoroscope?.dreamSymbols?.map((symbol, index) => (
                    <Badge key={index} className="bg-purple-500/20 text-purple-200 text-xs md:text-sm">
                      {symbol}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  These symbols in your dreams carry special significance for your sign today. Pay attention to their
                  context and emotions they evoke.
                </p>
              </div>

              {/* Cosmic Advice */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-6">
                <h4 className="font-medium text-yellow-300 mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Cosmic Guidance
                </h4>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">{currentHoroscope?.advice}</p>
              </div>
            </div>
          </GlassCard>

          {/* Moon Phase */}
          <GlassCard ref={moonRef}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Moon className="h-5 w-5 mr-2 text-blue-400" />
              Current Moon Phase
            </h2>

            <div className="text-center py-8">
              <div className="text-6xl mb-4">🌙</div>
              <h3 className="text-xl font-semibold text-blue-300 mb-2">Waning Crescent</h3>
              <p className="text-gray-300 mb-4">
                The moon is in its waning crescent phase, a time for release, reflection, and letting go. This is an
                ideal period for clearing negative energy and preparing for new beginnings.
              </p>
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-4">
                <h4 className="font-medium text-blue-300 mb-2">Moon Energy</h4>
                <p className="text-sm text-gray-300">
                  Focus on releasing what no longer serves you and trust in the natural cycles of renewal.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Daily Affirmation */}
          <GlassCard ref={affirmationRef}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-400" />
              Daily Affirmation
            </h2>

            <div className="text-center py-8">
              <div className="text-4xl mb-4">✨</div>
              <blockquote className="text-lg font-medium text-purple-300 mb-4">
                "I trust my inner wisdom and embrace the messages my dreams bring to my conscious mind."
              </blockquote>
              <p className="text-sm text-gray-400">
                Repeat this affirmation throughout your day to strengthen your connection to your subconscious mind.
              </p>
            </div>
          </GlassCard>

          {/* Zodiac Quick Reference */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4">Zodiac Signs</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {zodiacSigns.map((sign) => (
                <div
                  key={sign.name}
                  className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer hover:glow"
                  onClick={() => setSelectedZodiac(sign)}
                >
                  <div className="text-2xl mr-3">{sign.symbol}</div>
                  <div>
                    <p className="font-medium">{sign.name}</p>
                    <p className="text-xs text-gray-400">{sign.dates}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Zodiac Modal */}
      {selectedZodiac && <ZodiacModal zodiac={selectedZodiac} onClose={() => setSelectedZodiac(null)} />}
    </div>
  )
}
