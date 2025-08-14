"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { BookOpen, Search, Filter, Plus, Calendar, Heart, Zap, Trash2, MoreVertical } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import { DreamInterpretation } from "@/components/dream-interpretation"
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout"

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
  const [dreamEntries, setDreamEntries] = useState<any[]>([])
  const [dreamStats, setDreamStats] = useState({ total: 0, month: 0, topMood: '', topMoodPercentage: 0, topSymbol: '', topSymbolPercentage: 0 })
  const [deletingDreams, setDeletingDreams] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Initialize inactivity timeout (3 minutes)
  useInactivityTimeout(3)

  useEffect(() => {
    const fetchDreams = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return
      // Fetch all dreams
      const { data: dreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      console.log('Raw dreams from database:', dreams?.map(d => ({ title: d.title, date: d.date })))
      setDreamEntries(dreams || [])
      // Fetch stats
      if (dreams) {
        const total = dreams.length
        const month = dreams.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).length
        const moodCounts: Record<string, number> = {}
        const symbolCounts: Record<string, number> = {}
        dreams.forEach(d => {
          if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
          if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
        })
        const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const topMoodPercentage = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
        const rawTopSymbol = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
        const topSymbolCount = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
        // Get the most meaningful word from the top symbol (skip articles like "the", "a", "an")
        const words = rawTopSymbol.split(' ')
        const meaningfulWords = words.filter(word => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()))
        const topSymbol = meaningfulWords[0] || words[0] || ''
        const topMoodPercentageCalc = dreams && dreams.length > 0 ? Math.round((topMoodPercentage / dreams.length) * 100) : 0
        const topSymbolPercentage = dreams && dreams.length > 0 ? Math.round((topSymbolCount / dreams.length) * 100) : 0
        setDreamStats({ total, month, topMood, topMoodPercentage: topMoodPercentageCalc, topSymbol, topSymbolPercentage })
      }
    }
    fetchDreams()
  }, [])

  const deleteDream = async (dreamId: string, dreamTitle: string) => {
    setDeletingDreams(prev => new Set(prev).add(dreamId))
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', dreamId)

      if (error) {
        throw error
      }

      // Update local state to remove the deleted dream
      setDreamEntries(prev => prev.filter(dream => dream.id !== dreamId))
      
      // Clear selection if the deleted dream was selected
      if (selectedEntry?.id === dreamId) {
        setSelectedEntry(null)
      }
      
      // Refresh dream stats
      const user = (await supabase.auth.getUser()).data.user
      if (user) {
        const { data: allDreams } = await supabase
          .from('dreams')
          .select('mood,symbols,date')
          .eq('user_id', user.id)
        
        if (allDreams) {
          const total = allDreams.length
          const month = allDreams.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).length
          const moodCounts: Record<string, number> = {}
          const symbolCounts: Record<string, number> = {}
          allDreams.forEach(d => {
            if (d.mood) moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
            if (d.symbols) d.symbols.forEach((s: string) => symbolCounts[s] = (symbolCounts[s] || 0) + 1)
          })
                      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
                      const topMoodPercentage = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
                      const rawTopSymbol = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
                      const topSymbolCount = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0]?.[1] || 0
                      // Get the most meaningful word from the top symbol (skip articles like "the", "a", "an")
                      const words = rawTopSymbol.split(' ')
                      const meaningfulWords = words.filter(word => !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word.toLowerCase()))
                      const topSymbol = meaningfulWords[0] || words[0] || ''
                      const topMoodPercentageCalc = allDreams && allDreams.length > 0 ? Math.round((topMoodPercentage / allDreams.length) * 100) : 0
                      const topSymbolPercentage = allDreams && allDreams.length > 0 ? Math.round((topSymbolCount / allDreams.length) * 100) : 0
                      setDreamStats({ total, month, topMood, topMoodPercentage: topMoodPercentageCalc, topSymbol, topSymbolPercentage })
        }
      }

      toast({
        title: "Dream deleted",
        description: `"${dreamTitle}" has been removed from your journal.`,
      })
    } catch (error) {
      console.error('Error deleting dream:', error)
      toast({
        title: "Failed to delete dream",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setDeletingDreams(prev => {
        const newSet = new Set(prev)
        newSet.delete(dreamId)
        return newSet
      })
    }
  }

  const filteredEntries = [...dreamEntries]
    .filter(
      (entry) =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      console.log(`Sorting: ${a.title?.slice(0, 20)} (${a.date}) vs ${b.title?.slice(0, 20)} (${b.date}) = ${dateB - dateA}`)
      return dateB - dateA
          })

  console.log('Final filtered entries order:', filteredEntries.map(e => ({ title: e.title?.slice(0, 20), date: e.date })))

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
              <p className="text-2xl font-bold">{dreamStats.total}</p>
              <p className="text-sm text-gray-400">Total Dreams</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Calendar className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dreamStats.month}</p>
              <p className="text-sm text-gray-400">This Month</p>
            </GlassCard>
            <GlassCard className="text-center">
              <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dreamStats.topMood}</p>
              <p className="text-sm text-gray-400">Top Mood</p>
              <Badge className="mt-2 bg-pink-500/20 text-pink-300 text-xs">{dreamStats.topMoodPercentage || 0}%</Badge>
            </GlassCard>
            <GlassCard className="text-center">
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dreamStats.topSymbol}</p>
              <p className="text-sm text-gray-400">Top Symbol</p>
              <Badge className="mt-2 bg-yellow-500/20 text-yellow-300 text-xs">{dreamStats.topSymbolPercentage || 0}%</Badge>
            </GlassCard>
          </div>

          {/* Dream Entries */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Recent Entries</h2>
              {filteredEntries.map((entry) => (
                <GlassCard
                  key={entry.id}
                  className={`transition-all hover:glow ${
                    selectedEntry?.id === entry.id ? "ring-2 ring-purple-500/50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 
                      className="font-semibold cursor-pointer flex-1"
                      onClick={() => {
                        setSelectedEntry(entry)
                        // Auto-scroll to dream details section
                        setTimeout(() => {
                          const dreamDetailsSection = document.querySelector("[data-dream-details]")
                          if (dreamDetailsSection) {
                            dreamDetailsSection.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        }, 100)
                      }}
                    >
                      {entry.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={moodColors[entry.mood as keyof typeof moodColors] || "bg-gray-500/20"}>
                        {entry.mood}
                      </Badge>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-white/10"
                              disabled={deletingDreams.has(entry.id)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-400 cursor-pointer">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Dream
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Dream</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{entry.title}"? This action cannot be undone and will permanently remove this dream from your journal.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDream(entry.id, entry.title)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deletingDreams.has(entry.id)}
                            >
                              {deletingDreams.has(entry.id) ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedEntry(entry)
                      // Auto-scroll to dream details section
                      setTimeout(() => {
                        const dreamDetailsSection = document.querySelector("[data-dream-details]")
                        if (dreamDetailsSection) {
                          dreamDetailsSection.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      }, 100)
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-3">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{entry.description}</p>

                    <div className="flex flex-wrap gap-1">
                      {entry.symbols?.slice(0, 3).map((symbol: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Dream Detail */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Dream Details</h2>
              {selectedEntry ? (
                <GlassCard glow data-dream-details>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-purple-300">{selectedEntry.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={moodColors[selectedEntry.mood as keyof typeof moodColors]}>
                          {selectedEntry.mood}
                        </Badge>
                        <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                disabled={deletingDreams.has(selectedEntry.id)}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-400 cursor-pointer">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Dream
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Dream</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{selectedEntry.title}"? This action cannot be undone and will permanently remove this dream from your journal.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDream(selectedEntry.id, selectedEntry.title)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deletingDreams.has(selectedEntry.id)}
                              >
                                {deletingDreams.has(selectedEntry.id) ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedEntry.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Symbols</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.symbols?.map((symbol: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-purple-500/20">
                            {symbol}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedEntry.interpretation ? (
                      <div className="mt-6">
                        <DreamInterpretation 
                          content={selectedEntry.interpretation}
                          showTitle={true}
                        />
                      </div>
                    ) : null}
                  </div>
                </GlassCard>
              ) : (
                <GlassCard>
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
