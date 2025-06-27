"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-glow mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: December 27, 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <div className="space-y-4">
                <p>
                  At DreamVault, we collect information you provide directly to us, such as when you create an account,
                  record dreams, or contact us for support.
                </p>
                <h3 className="text-lg font-medium text-purple-300">Personal Information:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and email address</li>
                  <li>Birthday and zodiac sign (for personalized readings)</li>
                  <li>Dream entries and journal content</li>
                  <li>Usage data and preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Provide AI-powered dream interpretations and insights</li>
                <li>Generate personalized tarot readings and horoscopes</li>
                <li>Improve our services and develop new features</li>
                <li>Send you important updates about your account</li>
                <li>Provide customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this policy. We may share your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>With AI service providers to generate interpretations (data is anonymized)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. Your dream entries are encrypted and stored securely.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Export your dream journal data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide
                personalized content. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
              <p>
                DreamVault is not intended for children under 13. We do not knowingly collect personal information from
                children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Us</h2>
              <p>If you have any questions about this privacy policy, please contact us at:</p>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="font-medium">Email: support@dreamvault.ai</p>
                <p>We typically respond within 24 hours.</p>
              </div>
            </section>
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
