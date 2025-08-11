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
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
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
  const [gradientVisible, setGradientVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setGradientVisible(window.scrollY < 100)
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
    <main className="min-h-screen bg-black">
      {/* Background Gradient Animation */}
      <div className={`pointer-events-none absolute top-0 left-0 right-0 h-[100svh] transition-opacity duration-700 ease-out ${
          gradientVisible ? 'opacity-100' : 'opacity-0'
        } [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_65%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,1)_65%,rgba(0,0,0,0)_100%)]`}>
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(0, 0, 0)"
          gradientBackgroundEnd="rgb(0, 0, 0)"
          firstColor="147, 51, 234"
          secondColor="168, 85, 247"
          thirdColor="192, 132, 252"
          fourthColor="139, 69, 19"
          fifthColor="75, 0, 130"
          pointerColor="147, 51, 234"
          size="80%"
          blendingValue="multiply"
          containerClassName="absolute inset-0 h-full w-full"
          className="opacity-30"
          interactive={true}
        />
      </div>
      
      {/* Background Pattern removed to keep a single, uniform background */}
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'pt-4 px-4' : 'pt-6 px-0'
      }`}>
        <div className={`max-w-7xl mx-auto transition-all duration-500 ease-out relative ${
          scrolled 
            ? 'bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 px-6' 
            : 'bg-transparent border border-transparent px-4 sm:px-6 lg:px-8'
        }`}>
          {/* Glassmorphism overlay when scrolled */}
          {scrolled && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-2xl pointer-events-none" />
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
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    className={`text-white p-2 ${
                      scrolled 
                        ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl' 
                        : 'bg-white/10 hover:bg-white/20 rounded-lg border border-white/20'
                    }`}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="rounded-b-2xl p-6 border border-white/10 bg-black/70 supports-[backdrop-filter]:bg-black/60 backdrop-blur-xl"
                >
                  <SheetTitle className="sr-only">Mobile menu</SheetTitle>
                  <div className="space-y-4 mt-4">
                    {navigationItems.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <button
                          onClick={() => scrollToSection(item.href)}
                          className="w-full flex items-center px-4 py-3 rounded-xl transition-colors text-left text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                        >
                          {item.name}
                        </button>
                      </SheetClose>
                    ))}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex gap-2">
                        <Link href="/sign-in" className="flex-1">
                          <SheetClose asChild>
                            <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white">
                              Sign In
                            </Button>
                          </SheetClose>
                        </Link>
                        <Link href="/sign-up" className="flex-1">
                          <SheetClose asChild>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl text-white">
                              Interpret Dream
                            </Button>
                          </SheetClose>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation handled via Sheet above */}

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-28 min-h-screen min-h-[100svh]">
        {/* Hero bottom fade to blend gradient into a solid page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 z-10 min-h-[calc(100vh-7rem)] min-h-[calc(100svh-7rem)] flex flex-col justify-center">
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
        <div className="max-w-md md:max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-glow mb-4">Experience Your Personal Dream Universe</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get a glimpse of the powerful tools and insights waiting for you inside DreamVault
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 max-w-md md:max-w-6xl mx-auto">
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
                {/* Dream Input Section */}
                <div className="glass-card rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    Share Your Dream
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-24">
                    <p className="text-gray-400 text-sm italic">
                      "I was flying over mountains, feeling completely free and peaceful. The sky was crystal clear and I could see for miles..."
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">100/500 characters</span>
                    <Button size="sm" className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-purple-300">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Dream
                    </Button>
                  </div>
                </div>

                {/* Recent Dreams Grid */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-400" />
                      Recent Dreams
                    </h3>
                    {[
                      { title: "Flying Over Mountains", mood: "Hopeful", date: "2 days ago", symbols: ["Flying", "Mountains"] },
                      { title: "Lost in a Forest", mood: "Anxious", date: "1 week ago", symbols: ["Forest", "Lost"] },
                      { title: "Meeting an Old Friend", mood: "Nostalgic", date: "2 weeks ago", symbols: ["Friend", "Memory"] },
                    ].map((dream, index) => (
                      <div key={index} className="glass-card rounded-xl p-4 max-w-md mx-auto md:mx-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{dream.title}</h4>
                          <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300">
                            {dream.mood}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {dream.symbols.map((symbol, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">{dream.date}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                      Dream Analysis
                    </h3>
                    <div className="glass-card rounded-xl p-6 max-w-md mx-auto md:mx-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-purple-300">Key Symbols</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Flying", "Water", "Freedom"].map((symbol, i) => (
                              <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-blue-300">Emotional Tones</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Peace", "Joy", "Liberation"].map((emotion, i) => (
                              <Badge key={i} variant="secondary" className="bg-blue-500/20 text-blue-300">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-green-300">Summary</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            Your dream of flying represents a desire for freedom and transcendence. The mountains symbolize challenges you're overcoming, while the clear sky suggests clarity of vision.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: BookOpen, label: "Total Dreams", value: "23", color: "text-purple-400", badge: "+3 this week" },
                    { icon: BarChart3, label: "This Month", value: "7", color: "text-blue-400", badge: "+1% trend" },
                    { icon: Heart, label: "Top Mood", value: "Peaceful", color: "text-pink-400", badge: "35%" },
                    { icon: Zap, label: "Top Symbol", value: "Flying", color: "text-yellow-400", badge: "44%" },
                  ].map((stat, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 text-center">
                      <stat.icon className={`h-6 w-6 ${stat.color} mx-auto mb-2`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                      <Badge className={`text-xs px-2 py-1 ${
                        stat.label === "Total Dreams" ? "bg-green-500/20 text-green-300" :
                        stat.label === "This Month" ? "bg-green-500/20 text-green-300" :
                        stat.label === "Top Mood" ? "bg-blue-500/20 text-blue-300" :
                        "bg-yellow-500/20 text-yellow-300"
                      }`}>
                        {stat.badge}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Key Insights */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                    Key Insights
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      Your dream patterns reveal a rich tapestry of symbolic language with 23 unique symbols appearing across your dreams. The most frequent symbol "Flying" appears in 44% of your dreams, suggesting it holds particular significance for your subconscious mind.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Your emotional landscape shows Peaceful as the predominant feeling, appearing in 35% of your dreams. This suggests your subconscious is processing inner peace and contentment that deserve your attention.
                    </p>
                  </div>
                </div>

                {/* Symbol Analysis */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                    Symbol Analysis
                  </h3>
                  <div className="space-y-4">
                    {[
                      { symbol: "Flying", frequency: 10, percentage: 44, meaning: "Freedom and transcendence" },
                      { symbol: "Water", frequency: 7, percentage: 30, meaning: "Emotional depth and intuition" },
                      { symbol: "Mountains", frequency: 5, percentage: 22, meaning: "Challenges and growth" },
                    ].map((symbol, index) => (
                      <div key={index} className="border-l-4 border-purple-400 bg-purple-500/10 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-purple-300">{symbol.symbol}</h4>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-purple-500/20 text-purple-300 whitespace-nowrap">{symbol.frequency} times</Badge>
                            <Badge className="bg-blue-500/20 text-blue-300 whitespace-nowrap">{symbol.percentage}%</Badge>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{symbol.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotional Patterns */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-pink-400" />
                    Emotional Patterns
                  </h3>
                  <div className="space-y-3">
                    {[
                      { mood: "Peaceful", percentage: 35, color: "bg-blue-500", description: "Inner calm and contentment" },
                      { mood: "Curious", percentage: 24, color: "bg-green-500", description: "Exploration and learning" },
                      { mood: "Hopeful", percentage: 18, color: "bg-purple-500", description: "Optimism and faith" },
                    ].map((mood, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{mood.mood}</span>
                          <span className="text-sm text-gray-400">{mood.percentage}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className={`${mood.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${mood.percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400">{mood.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="readings" className="space-y-6">
                {/* Reading Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Shuffle, title: "Draw Cards", subtitle: "3-Card Spread", color: "text-purple-400", description: "Get guidance from the tarot" },
                    { icon: Star, title: "Horoscope", subtitle: "Daily Reading", color: "text-yellow-400", description: "Your zodiac insights" },
                    { icon: Moon, title: "Moon Phase", subtitle: "Current Energy", color: "text-blue-400", description: "Lunar influence today" },
                    { icon: Eye, title: "Affirmation", subtitle: "Daily Wisdom", color: "text-green-400", description: "Positive reinforcement" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-2xl p-6 text-center cursor-pointer hover:glow transition-all hover:scale-105"
                    >
                      <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-3`} />
                      <p className="font-medium text-lg mb-1">{item.title}</p>
                      <p className="text-sm text-gray-400 mb-2">{item.subtitle}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Sample Tarot Reading */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shuffle className="h-5 w-5 mr-2 text-purple-400" />
                    Sample Tarot Reading
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: "The Fool", meaning: "New beginnings and fresh starts", image: "🃏", position: "Past", description: "Represents innocence and taking leaps of faith" },
                      { name: "The Magician", meaning: "Manifestation and power", image: "🎩", position: "Present", description: "You have all the tools you need" },
                      { name: "The Star", meaning: "Hope and guidance", image: "⭐", position: "Future", description: "Light at the end of the tunnel" },
                    ].map((card, index) => (
                      <div key={index} className="glass-card rounded-xl p-4 text-center glow border border-purple-500/20">
                        <div className="text-4xl mb-3">{card.image}</div>
                        <h3 className="font-semibold text-purple-300 mb-2">{card.name}</h3>
                        <p className="text-sm text-gray-300 mb-2">{card.meaning}</p>
                        <p className="text-xs text-gray-400 mb-3">{card.description}</p>
                        <Badge className="bg-purple-500/20 text-purple-300">{card.position}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Horoscope Preview */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    Daily Horoscope Preview
                  </h3>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">♌</span>
                        <div>
                          <h4 className="font-semibold text-yellow-300">Leo</h4>
                          <p className="text-sm text-gray-400">July 23 - August 22</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300">Today</Badge>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Your natural leadership qualities are shining brightly today. The stars align to bring opportunities for creative expression and meaningful connections. Trust your intuition and embrace the spotlight - it's your time to shine!
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12">
        <div className="max-w-md md:max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-glow mb-4">Powerful Features for Your Spiritual Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to understand and explore your dreams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center hover:glow transition-transform duration-300 ease-out transform hover:scale-[1.03] hover:-translate-y-1 max-w-md mx-auto md:mx-0"
              >
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

      {/* Footer (Tailored from provided spec) */}
      <footer id="about" className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <Image
                  src="/logo2.svg"
                  alt="DreamVault"
                  width={120}
                  height={40}
                  className="h-9 w-auto"
                  priority
                />
              </div>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                AI-powered dream interpretation, tarot readings, horoscope insights, and a powerful dream journal to help you unlock the mysteries of your subconscious.
              </p>
              <div className="text-white/60 text-sm">© 2025 DreamVault. All rights reserved.</div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => scrollToSection("#home")}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("#features")}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("#pricing")}
                    className="text-white/60 hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact & Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:support@dreamvault.ai"
                    className="text-white/60 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@dreamvault.ai
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18336200635"
                    className="text-white/60 hover:text-white transition-colors duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +1 (833) 620-0635
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-white/50 text-sm mb-4 md:mb-0">Powered by AI</div>
              <div className="flex space-x-6">
                <a href="#" className="text-white/50 hover:text-white/80 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white/80 transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 10.956.557-.085.766-.343.766-.711 0-.367-.014-1.584-.22-2.869-3.338.724-4.042-1.416-4.042-1.416-.506-1.285-1.236-1.627-1.236-1.627-1.01-.69.077-.676.077-.676 1.116.078 1.703 1.146 1.703 1.146.993 1.701 2.604 1.209 3.237.924.101-.719.389-1.209.707-1.487-2.47-.281-5.065-1.235-5.065-5.498 0-1.213.434-2.205 1.146-2.981-.115-.282-.497-1.417.108-2.951 0 0 .934-.299 3.058 1.14.888-.247 1.84-.371 2.785-.375.943.004 1.896.128 2.786.375 2.123-1.439 3.056-1.14 3.056-1.14.606 1.534.224 2.669.11 2.951.713.776 1.145 1.768 1.145 2.981 0 4.274-2.599 5.213-5.076 5.487.4.344.755 1.024.755 2.063 0 1.49-.014 2.691-.014 3.056 0 .372.206.632.769.525C20.565 21.389 23.973 17.043 23.973 11.987 23.973 5.367 18.605.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/50 hover:text-white/80 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
