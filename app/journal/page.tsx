"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Filter, Plus, Calendar, Heart, Brain, Zap } from "lucide-react"

const dreamEntries = [
  {
    id: 1,
    title: "Flying Over the Ocean",
    date: "2024-01-15",
    mood: "Peaceful",
    symbols: ["Water", "Flying", "Freedom"],
    interpretation: "This dream suggests a desire for emotional freedom and clarity in your life.",
    content: "I was soaring high above crystal blue waters, feeling completely free and at peace...",
  },
  {
    id: 2,
    title: "Lost in a Maze",
    date: "2024-01-12",
    mood: "Confused",
    symbols: ["Maze", "Lost", "Searching"],
    interpretation: "The maze represents current life challenges and your search for direction.",
    content: "I found myself in an endless maze with walls that seemed to shift and change...",
  },
  {
    id: 3,
    title: "Talking to Animals",
    date: "2024-01-10",
    mood: "Curious",
    symbols: ["Animals", "Communication", "Nature"],
    interpretation: "This dream indicates a strong connection to your intuitive and natural self.",
    content: "A wise owl spoke to me in the forest, sharing ancient secrets...",
  },
]

const moodColors = {
  Peaceful: "bg-blue-500/20 text-blue-300",
  Confused: "bg-orange-500/20 text-orange-300",
  Curious: "bg-green-500/20 text-green-300",
  Anxious: "bg-red-500/20 text-red-300",
  Hopeful: "bg-purple-500/20 text-purple-300",
}

export default function JournalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<any>(null)

  const filteredEntries = dreamEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-glow flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-purple-400" />
                Dream Journal
              </h1>
              <p className="text-gray-400 mt-1">Your personal dream archive</p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 px-3">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Search and Filter */}
          <GlassCard>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your dreams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </GlassCard>

          {/* Dream Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="text-center">
              <BookOpen className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">23</p>
              <p className="text-sm text-gray-400">Total Dreams</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">7</p>
              <p className="text-sm text-gray-400">This Month</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">Peaceful</p>
              <p className="text-sm text-gray-400">Top Mood</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">Flying</p>
              <p className="text-sm text-gray-400">Top Symbol</p>
            </GlassCard>
          </div>

          {/* Dream Entries */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent Entries</h2>
              {filteredEntries.map((entry) => (
                <GlassCard
                  key={entry.id}
                  className={`cursor-pointer transition-all hover:glow ${
                    selectedEntry?.id === entry.id ? "ring-2 ring-purple-500/50" : ""
                  }`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{entry.title}</h3>
                    <Badge className={moodColors[entry.mood as keyof typeof moodColors] || "bg-gray-500/20"}>
                      {entry.mood}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{entry.content}</p>

                  <div className="flex flex-wrap gap-1">
                    {entry.symbols.slice(0, 3).map((symbol, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Dream Detail */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Dream Details</h2>
              {selectedEntry ? (
                <GlassCard glow>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-purple-300">{selectedEntry.title}</h3>
                      <Badge className={moodColors[selectedEntry.mood as keyof typeof moodColors]}>
                        {selectedEntry.mood}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-400">
                      {new Date(selectedEntry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <div>
                      <h4 className="font-medium mb-2">Dream Content</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.content}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Symbols</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.symbols.map((symbol: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-purple-500/20">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Interpretation</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.interpretation}</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" variant="outline">
                        Edit Entry
                      </Button>
                      <Button size="sm" variant="outline">
                        Re-analyze
                      </Button>
                      <Button size="sm" variant="outline">
                        Share
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard>
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Select a dream entry to view details and interpretation</p>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
