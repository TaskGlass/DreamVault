"use client"

import { useState, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Moon, Star, Shuffle, Eye, Heart } from "lucide-react"

const tarotCards = [
  { name: "The Fool", meaning: "New beginnings, innocence, spontaneity", image: "🃏" },
  { name: "The Magician", meaning: "Manifestation, resourcefulness, power", image: "🎩" },
  { name: "The High Priestess", meaning: "Intuition, sacred knowledge, divine feminine", image: "🌙" },
  { name: "The Empress", meaning: "Femininity, beauty, nature, abundance", image: "👑" },
  { name: "The Emperor", meaning: "Authority, establishment, structure", image: "⚡" },
  { name: "The Lovers", meaning: "Love, harmony, relationships, values alignment", image: "💕" },
]

const zodiacSigns = [
  { name: "Aries", dates: "Mar 21 - Apr 19", element: "Fire", symbol: "♈" },
  { name: "Taurus", dates: "Apr 20 - May 20", element: "Earth", symbol: "♉" },
  { name: "Gemini", dates: "May 21 - Jun 20", element: "Air", symbol: "♊" },
  { name: "Cancer", dates: "Jun 21 - Jul 22", element: "Water", symbol: "♋" },
  { name: "Leo", dates: "Jul 23 - Aug 22", element: "Fire", symbol: "♌" },
  { name: "Virgo", dates: "Aug 23 - Sep 22", element: "Earth", symbol: "♍" },
]

export default function ReadingsPage() {
  const [selectedCards, setSelectedCards] = useState<any[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentHoroscope, setCurrentHoroscope] = useState<any>(null)

  const tarotRef = useRef<HTMLDivElement>(null)
  const horoscopeRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)
  const affirmationRef = useRef<HTMLDivElement>(null)

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
      reading:
        "The stars align to bring clarity to your dreams today. Trust your intuition as it guides you toward new opportunities. Your creative energy is particularly strong, making this an ideal time for artistic pursuits or innovative problem-solving.",
      lucky: "Purple",
      advice: "Listen to your inner voice and pay attention to recurring symbols in your dreams.",
    })
  }

  const scrollToTarot = () => {
    drawTarotCards()
    setTimeout(() => {
      tarotRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const scrollToHoroscope = () => {
    getHoroscope()
    setTimeout(() => {
      horoscopeRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
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
          {currentHoroscope && (
            <GlassCard ref={horoscopeRef} glow>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Your Horoscope
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">♌</div>
                    <div>
                      <h3 className="font-semibold text-yellow-300">{currentHoroscope.sign}</h3>
                      <p className="text-sm text-gray-400">{currentHoroscope.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300">Lucky Color: {currentHoroscope.lucky}</Badge>
                </div>

                <p className="text-gray-300 leading-relaxed">{currentHoroscope.reading}</p>

                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-300 mb-2">Cosmic Advice</h4>
                  <p className="text-sm text-gray-300">{currentHoroscope.advice}</p>
                </div>
              </div>
            </GlassCard>
          )}

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {zodiacSigns.map((sign) => (
                <div
                  key={sign.name}
                  className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
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
    </div>
  )
}
