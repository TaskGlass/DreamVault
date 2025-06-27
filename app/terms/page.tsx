"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-glow mb-8">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: December 27, 2024</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using DreamVault, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                DreamVault is an AI-powered platform that provides dream interpretation, analysis, and spiritual
                insights. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Dream journal and recording capabilities</li>
                <li>AI-generated dream interpretations</li>
                <li>Tarot card readings and horoscopes</li>
                <li>Pattern analysis and insights</li>
                <li>Daily affirmations and spiritual guidance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p>To access certain features of DreamVault, you must create an account. You are responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
              <p>You agree not to use DreamVault to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Share inappropriate, harmful, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Content Ownership</h2>
              <div className="space-y-4">
                <p>
                  <strong>Your Content:</strong> You retain ownership of your dream entries and personal content. By
                  using our service, you grant us a license to process and analyze your content to provide our services.
                </p>
                <p>
                  <strong>Our Content:</strong> DreamVault's interpretations, insights, and generated content are
                  provided for entertainment and self-reflection purposes only.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Subscription and Payments</h2>
              <div className="space-y-4">
                <p>DreamVault offers both free and paid subscription plans. For paid subscriptions:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payments are processed securely through third-party providers</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>We reserve the right to change pricing with notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Disclaimers</h2>
              <div className="space-y-4">
                <p className="font-medium text-yellow-300">Important Notice:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>DreamVault is for entertainment and self-reflection purposes only</li>
                  <li>Our interpretations are not professional medical, psychological, or therapeutic advice</li>
                  <li>Always consult qualified professionals for serious concerns</li>
                  <li>We do not guarantee the accuracy of interpretations or predictions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>
                DreamVault shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
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
