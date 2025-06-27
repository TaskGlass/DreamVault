"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, ArrowLeft, Mail, MessageCircle, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function Support() {
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const subject = encodeURIComponent((formData.get("subject") as string) || "Support Request")
    const message = encodeURIComponent((formData.get("message") as string) || "")
    const name = encodeURIComponent((formData.get("name") as string) || "")
    const email = encodeURIComponent((formData.get("email") as string) || "")

    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`

    window.location.href = `mailto:support@dreamvault.ai?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
              <span className="text-xl font-bold text-glow">DreamVault</span>
            </div>
            <Link href="/home">
              <Button variant="outline" className="bg-white/5 border-white/20 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-glow mb-4">Support Center</h1>
          <p className="text-xl text-gray-300">We're here to help you on your dream journey</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <Mail className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold">Contact Us</h2>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please describe your question or issue in detail..."
                  className="bg-white/5 border-white/10 min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                Send Message
              </Button>
            </form>

            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-purple-400" />
                We typically respond within 24 hours
              </div>
            </div>
          </div>

          {/* FAQ and Info */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <MessageCircle className="h-6 w-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold">Direct Contact</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="font-medium text-purple-300 mb-2">Email Support</p>
                  <p className="text-gray-300">support@dreamvault.ai</p>
                  <p className="text-sm text-gray-400 mt-1">Available 24/7 - We respond within 24 hours</p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="font-medium text-purple-300 mb-2">Response Times</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• General inquiries: Within 24 hours</li>
                    <li>• Technical issues: Within 12 hours</li>
                    <li>• Billing questions: Within 6 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <HelpCircle className="h-6 w-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-purple-300 mb-2">How accurate are the dream interpretations?</h3>
                  <p className="text-sm text-gray-300">
                    Our AI provides interpretations based on common dream symbolism and psychological principles.
                    They're designed for self-reflection and entertainment, not as professional advice.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-purple-300 mb-2">Can I export my dream journal?</h3>
                  <p className="text-sm text-gray-300">
                    Yes! You can export your entire dream journal as a PDF or text file from your profile settings.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-purple-300 mb-2">How do I cancel my subscription?</h3>
                  <p className="text-sm text-gray-300">
                    You can cancel your subscription anytime from your account settings. Your access will continue until
                    the end of your current billing period.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-purple-300 mb-2">Is my dream data private and secure?</h3>
                  <p className="text-sm text-gray-300">
                    Absolutely. Your dreams are encrypted and stored securely. We never share your personal dream
                    content with third parties. See our Privacy Policy for full details.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-purple-300 mb-2">
                    What's the difference between subscription plans?
                  </h3>
                  <p className="text-sm text-gray-300">
                    Free users get 5 interpretations per month. Paid plans offer more interpretations, advanced features
                    like tarot readings, pattern analysis, and priority support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link
              href="/home"
              className="flex items-center mb-4 md:mb-0 hover:opacity-80 transition-opacity"
              onClick={() => window.scrollTo(0, 0)}
            >
              <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
              <span className="text-xl font-bold text-glow">DreamVault</span>
            </Link>

            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" onClick={() => window.scrollTo(0, 0)}>
                <button className="hover:text-purple-400">Privacy Policy</button>
              </Link>
              <Link href="/terms" onClick={() => window.scrollTo(0, 0)}>
                <button className="hover:text-purple-400">Terms of Service</button>
              </Link>
              <Link href="/support" onClick={() => window.scrollTo(0, 0)}>
                <button className="hover:text-purple-400">Support</button>
              </Link>
            </div>
          </div>

          <div className="text-left mt-8 text-gray-400 text-sm">
            © 2024 DreamVault. Unlock the mysteries of your mind.
          </div>
        </div>
      </footer>
    </div>
  )
}
