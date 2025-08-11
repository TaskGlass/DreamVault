"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Lightbulb, Eye, Moon, Star, Clock, CheckCircle, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout"

const techniques = [
  {
    id: 1,
    title: "Reality Checks",
    difficulty: "Beginner",
    duration: "Throughout the day",
    description: "Train your mind to question reality by performing regular reality checks during waking hours.",
    steps: [
      "Look at your hands - count your fingers",
      "Check digital clocks twice - time often changes in dreams",
      "Read text, look away, then read again - text is unstable in dreams",
      "Ask yourself 'Am I dreaming?' several times daily",
      "Push your finger through your palm - it will pass through in dreams",
    ],
    benefits: ["Increased dream awareness", "Better dream recall", "Foundation for lucid dreaming"],
    tips: "Set phone reminders every 2-3 hours to perform reality checks consistently.",
  },
  {
    id: 2,
    title: "Dream Journal Method",
    difficulty: "Beginner",
    duration: "5-10 minutes daily",
    description: "Improve dream recall and awareness by maintaining a detailed dream journal.",
    steps: [
      "Keep journal and pen beside your bed",
      "Write dreams immediately upon waking",
      "Record every detail you remember, no matter how small",
      "Note emotions, colors, people, and symbols",
      "Look for recurring patterns and dream signs",
    ],
    benefits: ["Enhanced dream recall", "Pattern recognition", "Increased dream awareness"],
    tips: "Even if you don't remember dreams, write 'No recall' - this trains your subconscious to remember.",
  },
  {
    id: 3,
    title: "Wake-Back-to-Bed (WBTB)",
    difficulty: "Intermediate",
    duration: "30-60 minutes",
    description: "Wake up early, stay awake briefly, then return to sleep to enter REM sleep consciously.",
    steps: [
      "Set alarm 4-6 hours after falling asleep",
      "Wake up and stay awake for 15-30 minutes",
      "Think about lucid dreaming and set intentions",
      "Read about lucid dreaming or review dream journal",
      "Return to sleep with strong intention to become lucid",
    ],
    benefits: ["Higher lucid dream success rate", "Enters REM sleep consciously", "Vivid dream experiences"],
    tips: "Practice on weekends when you can afford interrupted sleep. This technique has the highest success rate.",
  },
  {
    id: 4,
    title: "Mnemonic Induction (MILD)",
    difficulty: "Intermediate",
    duration: "10-15 minutes",
    description: "Use memory techniques and affirmations to program your mind for lucid dreaming.",
    steps: [
      "As you fall asleep, repeat 'Next time I'm dreaming, I'll remember I'm dreaming'",
      "Visualize yourself becoming lucid in a recent dream",
      "Imagine recognizing dream signs and becoming aware",
      "Feel the excitement of realizing you're dreaming",
      "Continue until you fall asleep with this intention",
    ],
    benefits: ["Programs subconscious mind", "Increases dream awareness", "Works well with other techniques"],
    tips: "Combine with WBTB for maximum effectiveness. Belief and intention are crucial for success.",
  },
  {
    id: 5,
    title: "Visualization Technique",
    difficulty: "Advanced",
    duration: "15-20 minutes",
    description: "Use detailed visualization to maintain consciousness while entering the dream state.",
    steps: [
      "Lie down in a comfortable position",
      "Relax your body completely using progressive relaxation",
      "Visualize a simple scene (like climbing stairs)",
      "Maintain awareness while your body falls asleep",
      "When the visualization becomes vivid and autonomous, you're dreaming",
    ],
    benefits: ["Direct entry into lucid dreams", "No sleep interruption needed", "Develops meditation skills"],
    tips: "This technique requires practice and patience. Start with shorter sessions and gradually increase duration.",
  },
  {
    id: 6,
    title: "Lucid Dream Stabilization",
    difficulty: "Advanced",
    duration: "Within the dream",
    description: "Techniques to maintain and extend lucid dreams once you become aware.",
    steps: [
      "Stay calm when you realize you're dreaming",
      "Rub your hands together to increase tactile sensation",
      "Spin around in the dream to prevent waking up",
      "Touch objects in the dream to ground yourself",
      "Shout 'Increase clarity now!' to enhance dream vividness",
    ],
    benefits: ["Longer lucid dreams", "More vivid experiences", "Better dream control"],
    tips: "Practice these techniques in regular dreams first. The key is remaining calm and not getting too excited.",
  },
]

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-300",
  Intermediate: "bg-yellow-500/20 text-yellow-300",
  Advanced: "bg-red-500/20 text-red-300",
}

const difficultyOrder = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

export default function TechniquesPage() {
  const router = useRouter()
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: number }>({})
  const [skillFilter, setSkillFilter] = useState("all")

  // Initialize inactivity timeout (3 minutes)
  useInactivityTimeout(3)

  const toggleStep = (techniqueId: number, stepIndex: number, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent the card click event from firing
    setCompletedSteps((prev) => {
      const current = prev[techniqueId] || 0
      const newCount = stepIndex < current ? stepIndex : stepIndex + 1
      return { ...prev, [techniqueId]: newCount }
    })
  }

  const handleCardClick = (technique: any) => {
    setSelectedTechnique(selectedTechnique?.id === technique.id ? null : technique)
  }

  const getProgress = (techniqueId: number, totalSteps: number) => {
    const completed = completedSteps[techniqueId] || 0
    return Math.round((completed / totalSteps) * 100)
  }

  // Auto-reset progress when 100% is reached
  useEffect(() => {
    Object.keys(completedSteps).forEach((techniqueIdStr) => {
      const techniqueId = Number.parseInt(techniqueIdStr)
      const technique = techniques.find((t) => t.id === techniqueId)
      if (technique && completedSteps[techniqueId] >= technique.steps.length) {
        // Reset after a short delay to show the completion
        setTimeout(() => {
          setCompletedSteps((prev) => ({
            ...prev,
            [techniqueId]: 0,
          }))
        }, 2000)
      }
    })
  }, [completedSteps])

  // Filter and sort techniques
  const filteredTechniques = techniques
    .filter((technique) => {
      if (skillFilter === "all") return true
      return technique.difficulty === skillFilter
    })
    .sort((a, b) => {
      return (
        difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
        difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
      )
    })

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-8 pb-28 md:ml-72 md:pb-8">
        <div className="p-4 space-y-4 sm:space-y-6">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm">
                <Lightbulb className="h-12 w-12 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-glow mb-2">Lucid Dreaming Techniques</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Master the art of conscious dreaming with these proven techniques and unlock the full potential of your
              dream world
            </p>
          </div>

          {/* Filter */}
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full bg-white/5 border-white/10">
                  <SelectValue placeholder="Filter by skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skill Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Overview */}
          <GlassCard glow>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-purple-400" />
              Getting Started
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div
                className="text-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-green-500/20 hover:to-blue-500/20 transition-all"
                onClick={() => setSkillFilter("Beginner")}
              >
                <div className="text-2xl font-bold text-green-300">Beginner</div>
                <p className="text-sm text-gray-400">Start Here</p>
              </div>
              <div
                className="text-center p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-orange-500/20 transition-all"
                onClick={() => setSkillFilter("Intermediate")}
              >
                <div className="text-2xl font-bold text-yellow-300">Intermediate</div>
                <p className="text-sm text-gray-400">Build Skills</p>
              </div>
              <div
                className="text-center p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all"
                onClick={() => setSkillFilter("Advanced")}
              >
                <div className="text-2xl font-bold text-red-300">Advanced</div>
                <p className="text-sm text-gray-400">Master Level</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-6">
              <h3 className="font-semibold text-purple-300 mb-3">Important Guidelines</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  • <strong>Consistency is key:</strong> Practice techniques regularly for best results
                </li>
                <li>
                  • <strong>Be patient:</strong> Lucid dreaming skills develop over time
                </li>
                <li>
                  • <strong>Keep a dream journal:</strong> Essential for all techniques
                </li>
                <li>
                  • <strong>Get quality sleep:</strong> Well-rested minds have better dream recall
                </li>
                <li>
                  • <strong>Stay positive:</strong> Belief and intention greatly influence success
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* Techniques Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTechniques.map((technique) => (
              <GlassCard
                key={technique.id}
                className={`cursor-pointer transition-all hover:glow ${selectedTechnique?.id === technique.id ? "ring-2 ring-purple-500/50" : ""}`}
                onClick={() => handleCardClick(technique)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <h3 className="text-xl font-semibold text-purple-300">{technique.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={difficultyColors[technique.difficulty as keyof typeof difficultyColors]}>
                      {technique.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {technique.duration}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">{technique.description}</p>

                {selectedTechnique?.id === technique.id && (
                  <div className="space-y-6 border-t border-white/10 pt-6">
                    {/* Steps */}
                    <div>
                      <h4 className="font-semibold text-yellow-300 mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Step-by-Step Guide
                      </h4>
                      <div className="space-y-2">
                        {technique.steps.map((step, index) => (
                          <div
                            key={index}
                            className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${
                              (completedSteps[technique.id] || 0) > index
                                ? "bg-green-500/10 border border-green-500/20"
                                : "bg-white/5 hover:bg-white/10"
                            }`}
                            onClick={(e) => toggleStep(technique.id, index, e)}
                          >
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-transform ${
                                (completedSteps[technique.id] || 0) > index
                                  ? "border-green-400 bg-green-400"
                                  : "border-gray-400"
                              }`}
                            >
                              {(completedSteps[technique.id] || 0) > index && (
                                <CheckCircle className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm font-medium">
                            {getProgress(technique.id, technique.steps.length)}%
                            {getProgress(technique.id, technique.steps.length) === 100 && (
                              <span className="text-green-400 ml-2">✨ Complete!</span>
                            )}
                          </span>
                        </div>
                        <Progress value={getProgress(technique.id, technique.steps.length)} className="h-2" />
                        {getProgress(technique.id, technique.steps.length) === 100 && (
                          <p className="text-xs text-green-400 mt-1">Progress will reset in 2 seconds...</p>
                        )}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-green-300 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {technique.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center">
                            <Star className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Pro Tip
                      </h4>
                      <p className="text-sm text-gray-300">{technique.tips}</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))}
          </div>

          {/* Additional Resources */}
          <GlassCard>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Moon className="h-5 w-5 mr-2 text-blue-400" />
              Additional Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-purple-300 mb-2">Recommended Reading</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• "Exploring the World of Lucid Dreaming" by Stephen LaBerge</li>
                    <li>• "Lucid Dreaming: Gateway to the Inner Self" by Robert Waggoner</li>
                    <li>• "The Lucid Dreamer" by Malcolm Godwin</li>
                  </ul>
                </div>

                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
                  <h3 className="font-semibold text-green-300 mb-2">Apps & Tools</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Dream journal apps for tracking progress</li>
                    <li>• Reality check reminder apps</li>
                    <li>• Binaural beats for enhanced REM sleep</li>
                    <li>• Light-based lucid dreaming devices</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl">
                  <h3 className="font-semibold text-yellow-300 mb-2">Safety Guidelines</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Don't sacrifice regular sleep for lucid dreaming</li>
                    <li>• Avoid techniques if you have sleep disorders</li>
                    <li>• Take breaks if you experience sleep disruption</li>
                    <li>• Consult a doctor if you have concerns</li>
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
