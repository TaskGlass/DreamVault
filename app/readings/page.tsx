"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Moon, Star, Shuffle, Eye, Heart, X } from "lucide-react"
import { createPortal } from "react-dom"

const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity", image: "🃏" },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, power", image: "🎩" },
  { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine", image: "🌙" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, abundance", image: "👑" },
  { name: "The Emperor", meaning: "Authority, establishment, structure", image: "⚡" },
  { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment", image: "💕" },
]

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

  const tarotRef = useRef<HTMLDivElement>(null)
  const horoscopeRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const affirmationRef = useRef<HTMLDivElement>(null)

  // Add this useEffect after the existing state declarations
  useEffect(() => {
    // Show horoscope by default when page loads
    getHoroscope()

    // Check if user came from dashboard wanting to see horoscope
    const showHoroscope = sessionStorage.getItem("showHoroscope")
    if (showHoroscope) {
      sessionStorage.removeItem("showHoroscope")
      setTimeout(() => {
        horoscopeRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [])

  const drawTarotCards = () => {
    setIsDrawing(true)
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5)
      setSelectedCards(shuffled.slice(0, 3))
      setIsDrawing(false)
    }, 2000)
  }

  const getHoroscope = () => {
    setCurrentHoroscope({
      sign: "Leo",
      date: "Today",
      symbol: "♌",
      element: "Fire",
      rulingPlanet: "Sun",
      reading:
        "The Sun's radiant energy illuminates your path today, dear Leo. Your natural magnetism and creative fire are at their peak, drawing opportunities and admirers into your orbit. The cosmic energies are aligning to support your artistic endeavors and leadership qualities. This is a powerful day for self-expression and stepping into your authentic power.",
      love: "Venus whispers sweet possibilities in your romantic sector. Single Leos may find themselves captivated by someone who appreciates their unique brilliance. Coupled Leos should focus on grand gestures and heartfelt communication. Your partner craves your attention and admiration - don't hold back on the compliments.",
      career:
        "Your professional life sparkles with potential today. The Sun's influence brings recognition for your hard work and creative contributions. A leadership opportunity may present itself, or you might find yourself naturally taking charge of a project. Trust your instincts when making important decisions.",
      health:
        "Your vitality runs high, but remember that even the Sun needs to set. Balance your fiery energy with moments of rest and reflection. Pay attention to your heart - both literally and metaphorically. Cardiovascular exercise will serve you well today.",
      lucky: "Golden Yellow",
      luckyNumbers: [3, 7, 19, 28],
      bestTime: "11:00 AM - 1:00 PM",
      moonPhase: "Waxing Gibbous in Sagittarius",
      planetaryInfluence:
        "The Sun in your sign amplifies your natural charisma, while Mercury enhances your communication skills. Jupiter's supportive aspect brings expansion and good fortune.",
      dreamSymbols: [
        "Golden lions",
        "Bright sunlight",
        "Crowns or royal imagery",
        "Stage performances",
        "Fire or flames",
      ],
      advice:
        "Embrace your inner royalty today, Leo. The universe is your stage, and you are the star. Don't dim your light for anyone - your authentic self is your greatest gift to the world. Pay special attention to dreams featuring gold, lions, or performance themes, as they carry messages about your true calling and creative potential.",
    })
  }

  const scrollToTarot = () => {
    drawTarotCards()
    setTimeout(() => {
      tarotRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const scrollToHoroscope = () => {
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
                <p className="text-gray-300 leading-relaxed">{currentHoroscope?.reading}</p>
              </div>

              {/* Life Areas Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-pink-300 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Love & Relationships
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{currentHoroscope?.love}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-green-300 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Career & Finance
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{currentHoroscope?.career}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-blue-300 mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Health & Wellness
                  </h5>
                  <p className="text-xs text-gray-300 leading-relaxed">{currentHoroscope?.health}</p>
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4">
                  <h5 className="font-medium text-purple-300 mb-3">Lucky Elements</h5>
                  <div className="space-y-2 text-sm">
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
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Moon Phase:</span>
                      <p className="text-indigo-300 text-xs">{currentHoroscope?.moonPhase}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Planetary Energy:</span>
                      <p className="text-indigo-300 text-xs">{currentHoroscope?.planetaryInfluence}</p>
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
                    <Badge key={index} className="bg-purple-500/20 text-purple-200 text-xs">
                      {symbol}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
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
                <p className="text-sm text-gray-300 leading-relaxed">{currentHoroscope?.advice}</p>
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
