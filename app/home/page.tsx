"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pricing } from "@/components/ui/pricing"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Moon,
  Star,
  Eye,
  EyeOff,
  Heart,
  Zap,
  Crown,
  ArrowRight,
  Check,
  BarChart3,
  BookOpen,
  Shuffle,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "Preview", href: "#preview" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
]

const features = [
  {
    icon: Sparkles,
    title: "AI Dream Interpretation",
    description: "Get personalized insights from your dreams using advanced AI technology",
  },
  {
    icon: BookOpen,
    title: "Dream Journal",
    description: "Save, organize, and track your dreams with mood and symbol analysis",
  },
  {
    icon: BarChart3,
    title: "Pattern Insights",
    description: "Discover recurring themes and emotional patterns in your subconscious",
  },
  {
    icon: Shuffle,
    title: "Tarot Readings",
    description: "Receive mystical guidance with AI-powered tarot card interpretations",
  },
  {
    icon: Star,
    title: "Horoscope Integration",
    description: "Personalized astrological insights based on your zodiac profile",
  },
  {
    icon: Heart,
    title: "Daily Affirmations",
    description: "Positive affirmations tailored to your dream themes and spiritual journey",
  },
]

const plans = [
  {
    name: "Dream Lite",
    monthlyPrice: "Free",
    annualPrice: "Free",
    annualDisplay: "Free",
    icon: Sparkles,
    color: "text-gray-400",
    features: [
      "5 dream interpretations",
      "5 tarot readings",
      "Basic dream journal",
      "Save dreams",
      "Community support",
    ],
  },
  {
    name: "Lucid Explorer",
    monthlyPrice: "$9/month",
    annualPrice: "$5/month",
    annualDisplay: "$60/year",
    annualSavings: "Save $48/year",
    icon: Zap,
    color: "text-purple-400",
    popular: true,
    features: [
      "15 dream interpretations",
      "15 tarot readings",
      "Advanced mood & emotion insights",
      "Daily affirmations",
      "Personalized horoscope readings",
      "Pattern analysis",
      "Priority email support",
    ],
  },
  {
    name: "Astral Voyager",
    monthlyPrice: "$19/month",
    annualPrice: "$9/month",
    annualDisplay: "$108/year",
    annualSavings: "Save $120/year",
    icon: Crown,
    color: "text-yellow-400",
    features: [
      "30 dream interpretations",
      "30 tarot readings",
      "Weekly dream pattern summaries",
      "Shareable dream reports",
      "Advanced symbol analysis",
      "Priority support",
    ],
  },
]

const zodiacSigns = [
  { name: "Aries", symbol: "♈", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", symbol: "♉", dates: "Apr 20 - May 20" },
  { name: "Gemini", symbol: "♊", dates: "May 21 - Jun 22" },
  { name: "Cancer", symbol: "♋", dates: "Jun 21 - Jul 22" },
  { name: "Leo", symbol: "♌", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", symbol: "♍", dates: "Aug 23 - Sep 22" },
  { name: "Libra", symbol: "♎", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", symbol: "♏", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", symbol: "♑", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", symbol: "♒", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", symbol: "♓", dates: "Feb 19 - Mar 20" },
]

export default function LandingPage() {
  const [authTab, setAuthTab] = useState("signup")
  const [previewTab, setPreviewTab] = useState("journal")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [billingCycle, setBillingCycle] = useState("monthly")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen">
      {/* Site-wide seamless animated background */}
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 15, 30)"
        gradientBackgroundEnd="rgb(25, 35, 55)"
        firstColor="147, 51, 234"
        secondColor="168, 85, 247"
        thirdColor="192, 132, 252"
        fourthColor="139, 69, 19"
        fifthColor="75, 0, 130"
        size="140%"
        blendingValue="soft-light"
        containerClassName="fixed inset-0 -z-10 pointer-events-none"
        className="opacity-60"
      />
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'pt-4 px-4' : 'pt-6 px-0'
      }`}>
        <div className={`max-w-7xl mx-auto transition-all duration-500 ease-out relative ${
          scrolled 
            ? 'bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-900/50 px-6' 
            : 'bg-transparent border border-transparent px-4 sm:px-6 lg:px-8'
        }`}>
          {/* Glassmorphism overlay when scrolled */}
          {scrolled && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none" />
          )}
          <div className="flex items-center justify-between h-16 relative z-10">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="DreamVault Logo" 
                  className="h-8 w-auto transition-all duration-700"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`transition-all duration-300 text-sm font-medium ${
                    scrolled 
                      ? 'text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/sign-in">
                <Button
                  className={`text-white px-4 py-2 font-medium transition-all duration-300 ${
                    scrolled 
                      ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl' 
                      : 'bg-white/10 hover:bg-white/20 rounded-lg border border-white/20'
                  }`}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className={`text-white px-6 py-2 font-medium transition-all duration-300 ${
                    scrolled 
                      ? 'bg-purple-600/90 hover:bg-purple-600 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg shadow-purple-600/25' 
                      : 'bg-purple-600 hover:bg-purple-700 rounded-lg'
                  }`}
                >
                  Interpret Dream
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`text-white p-2 ${
                  scrolled 
                    ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl' 
                    : 'bg-white/10 hover:bg-white/20 rounded-lg border border-white/20'
                }`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-20 left-4 right-4 bg-gradient-to-b from-purple-900/95 to-purple-800/95 backdrop-blur-2xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-purple-900/50 p-6">
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    scrollToSection(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-xl transition-all text-left text-white/80 hover:text-white hover:bg-white/10"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-white/10 pt-4">
                <Link href="/sign-in">
                  <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="block mt-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl text-white">
                    Interpret Dream
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-28">
        {/* Hero-local gradient overlay (adds depth on top of site-wide bg) */}
        <BackgroundGradientAnimation
          gradientBackgroundStart="transparent"
          gradientBackgroundEnd="transparent"
          firstColor="147, 51, 234"
          secondColor="168, 85, 247"
          thirdColor="192, 132, 252"
          fourthColor="139, 69, 19"
          fifthColor="75, 0, 130"
          size="130%"
          blendingValue="soft-light"
          containerClassName="absolute inset-0 pointer-events-none"
          className="opacity-50"
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12 z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img
                src="/logo.svg"
                alt="DreamVault"
                className="h-16 md:h-20 w-auto"
              />
            </div>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock the mysteries of your subconscious with AI-powered dream interpretation, tarot readings, and
              personalized spiritual insights
            </p>

            <div className="flex justify-center w-full max-w-xs mx-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 text-lg px-10 py-4 h-[60px] font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 border-0 w-full"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Interpret Dream
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Auth Section */}
          <div id="auth" className="max-w-md mx-auto mb-12">
            <div className="glass-card rounded-2xl p-6 glow">
              <Tabs value={authTab} onValueChange={setAuthTab}>
                <TabsList className="grid w-full grid-cols-2 bg-white/5">
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  <TabsTrigger value="login">Log In</TabsTrigger>
                </TabsList>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" placeholder="Enter your name" className="bg-white/5 border-white/10" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Birthday</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">January</SelectItem>
                          <SelectItem value="02">February</SelectItem>
                          <SelectItem value="03">March</SelectItem>
                          <SelectItem value="04">April</SelectItem>
                          <SelectItem value="05">May</SelectItem>
                          <SelectItem value="06">June</SelectItem>
                          <SelectItem value="07">July</SelectItem>
                          <SelectItem value="08">August</SelectItem>
                          <SelectItem value="09">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                            <SelectItem key={day} value={day.toString().padStart(2, "0")}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-zodiac">Zodiac Sign</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Select your zodiac sign" />
                      </SelectTrigger>
                      <SelectContent>
                        {zodiacSigns.map((sign) => (
                          <SelectItem key={sign.name} value={sign.name}>
                            {sign.symbol} {sign.name} ({sign.dates})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="bg-white/5 border-white/10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Create Account</Button>

                  <p className="text-xs text-gray-400 text-center">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </TabsContent>

                <TabsContent value="login" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/5 border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-white/5 border-white/10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">Sign In</Button>

                  <p className="text-xs text-gray-400 text-center">
                    <button className="hover:text-purple-400" onClick={() => scrollToSection("#home")}>
                      Forgot your password?
                    </button>
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-glow mb-4">Experience Your Personal Dream Universe</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get a glimpse of the powerful tools and insights waiting for you inside DreamVault
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 max-w-6xl mx-auto">
            <Tabs value={previewTab} onValueChange={setPreviewTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-8 h-auto p-1 text-xs sm:text-sm">
                <TabsTrigger value="journal" className="px-3 py-2 sm:px-4 sm:py-2">
                  Journal
                </TabsTrigger>
                <TabsTrigger value="insights" className="px-3 py-2 sm:px-4 sm:py-2">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="readings" className="px-3 py-2 sm:px-4 sm:py-2">
                  Readings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="journal" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Dreams</h3>
                    {[
                      { title: "Flying Over Mountains", mood: "Hopeful", date: "2 days ago" },
                      { title: "Lost in a Forest", mood: "Anxious", date: "1 week ago" },
                      { title: "Meeting an Old Friend", mood: "Nostalgic", date: "2 weeks ago" },
                    ].map((dream, index) => (
                      <div key={index} className="glass-card rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{dream.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {dream.mood}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{dream.date}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dream Analysis</h3>
                    <div className="glass-card rounded-xl p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Symbols</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Flying", "Water", "Freedom"].map((symbol, i) => (
                              <Badge key={i} variant="secondary" className="bg-purple-500/20">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Emotions</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Peace", "Joy", "Liberation"].map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="bg-blue-500/20">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BookOpen, label: "Total Dreams", value: "23", color: "text-purple-400" },
                    { icon: BarChart3, label: "This Month", value: "7", color: "text-blue-400" },
                    { icon: Heart, label: "Top Mood", value: "Peaceful", color: "text-pink-400" },
                    { icon: Zap, label: "Top Symbol", value: "Flying", color: "text-yellow-400" },
                  ].map((stat, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 text-center rounded-xl">
                      <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-6 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Emotional Patterns</h3>
                  <div className="space-y-3">
                    {[
                      { mood: "Peaceful", percentage: 35, color: "bg-blue-500" },
                      { mood: "Curious", percentage: 24, color: "bg-green-500" },
                      { mood: "Hopeful", percentage: 18, color: "bg-purple-500" },
                    ].map((mood, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span>{mood.mood}</span>
                          <span className="text-sm text-gray-400">{mood.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${mood.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="readings" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Shuffle, title: "Draw Cards", subtitle: "3-Card Spread", color: "text-purple-400" },
                    { icon: Star, title: "Horoscope", subtitle: "Daily Reading", color: "text-yellow-400" },
                    { icon: Moon, title: "Moon Phase", subtitle: "Current Energy", color: "text-blue-400" },
                    { icon: Eye, title: "Affirmation", subtitle: "Daily Wisdom", color: "text-green-400" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-2xl p-6 text-center cursor-pointer hover:glow transition-all rounded-xl"
                    >
                      <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} />
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.subtitle}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "The Fool", meaning: "New beginnings", image: "🃏", position: "Past" },
                    { name: "The Magician", meaning: "Manifestation", image: "🎩", position: "Present" },
                    { name: "The Star", meaning: "Hope & guidance", image: "⭐", position: "Future" },
                  ].map((card, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 text-center glow rounded-xl">
                      <div className="text-4xl mb-3">{card.image}</div>
                      <h3 className="font-semibold text-purple-300 mb-2">{card.name}</h3>
                      <p className="text-sm text-gray-300 mb-3">{card.meaning}</p>
                      <Badge className="bg-purple-500/20">{card.position}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-glow mb-4">Powerful Features for Your Spiritual Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to understand and explore your dreams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center hover:glow transition-all">
                <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12">
        <Pricing />
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            {/* Brand */}
            <div className="flex justify-center md:justify-start">
              <Link
                href="/home"
                className="flex items-center hover:opacity-90 transition-opacity"
                onClick={() => window.scrollTo(0, 0)}
              >
                <img
                  src="/logo.svg"
                  alt="DreamVault Logo"
                  className="h-8 w-auto"
                />
                <span className="sr-only">DreamVault</span>
              </Link>
            </div>

            {/* Contact */}
            <div className="text-center">
              <div className="text-gray-300 font-medium">Customer Service</div>
              <div className="mt-1 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
                <a href="mailto:support@dreamvault.ai" className="hover:text-purple-400 transition-colors">
                  support@dreamvault.ai
                </a>
                <span className="hidden sm:block text-white/20">•</span>
                <a href="tel:+18336200635" className="hover:text-purple-400 transition-colors">
                  +1 (833) 620-0635
                </a>
              </div>
            </div>

            {/* Links */}
            <div className="flex justify-center md:justify-end gap-6 text-sm text-gray-400">
              <Link href="/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-purple-400">
                Privacy Policy
              </Link>
              <Link href="/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-purple-400">
                Terms
              </Link>
              <Link href="/support" onClick={() => window.scrollTo(0, 0)} className="hover:text-purple-400">
                Support
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2024 DreamVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
