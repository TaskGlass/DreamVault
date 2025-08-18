"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, Crown, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

type Plan = {
  name: string
  monthlyPrice: string
  annualPrice: string
  annualDisplay?: string
  annualSavings?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  popular?: boolean
  features: string[]
}

const dreamVaultPlans: Plan[] = [
  {
    name: "Dream Lite",
    monthlyPrice: "Free",
    annualPrice: "Free",
    annualDisplay: "Free",
    icon: Sparkles,
    color: "text-gray-400",
    features: [
      "5 dream interpretations",
      "30 daily horoscopes",
      "10 affirmations",
      "10 moon phases",
      "Basic dream journal",
      "Community support",
    ],
  },
  {
    name: "Lucid Explorer",
    monthlyPrice: "$9",
    annualPrice: "$5",
    annualDisplay: "$60/year",
    annualSavings: "Save $48/year",
    icon: Zap,
    color: "text-purple-400",
    popular: true,
    features: [
      "50 dream interpretations",
      "30 daily horoscopes",
      "50 affirmations",
      "50 moon phases",
      "Advanced mood & emotion insights",
      "Priority email support",
    ],
  },
  {
    name: "Astral Voyager",
    monthlyPrice: "$19",
    annualPrice: "$9",
    annualDisplay: "$108/year",
    annualSavings: "Save $120/year",
    icon: Crown,
    color: "text-yellow-400",
    features: [
      "200 dream interpretations",
      "30 daily horoscopes",
      "200 affirmations",
      "200 moon phases",
      "Weekly dream pattern summaries",
      "Shareable dream reports",
      "Advanced symbol analysis",
      "Priority support",
    ],
  },
]

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
  const handleChoosePlan = async (planName: string) => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) {
      window.location.href = `/sign-up?plan=${encodeURIComponent(planName)}&cycle=${billingCycle}`
      return
    }
    const email = session.user.email || undefined
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan: planName, billingCycle })
    })
    const data = await res.json()
    if (data?.url) window.location.href = data.url
  }

  return (
    <div className="max-w-md md:max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-glow mb-2">Choose Your Spiritual Path</h2>
        <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">Start free and upgrade as your journey deepens</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/5 rounded-full p-1 border border-white/10">
          <div className="flex">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                billingCycle === "monthly"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-white/10",
              )}
            >
              Monthly
            </Button>
            <div className="relative">
              <Button
                variant={billingCycle === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("annual")}
                className={cn(
                  "px-6 py-2 rounded-full transition-all",
                  billingCycle === "annual"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10",
                )}
              >
                Annual
              </Button>
              <Badge className="absolute -top-4 -right-4 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                Save 17%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-md md:max-w-6xl mx-auto">
        {dreamVaultPlans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative p-6 rounded-2xl border transition-all duration-300 hover:scale-105",
              plan.popular
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 shadow-xl shadow-purple-500/20"
                : "bg-white/5 border-white/10 hover:border-white/20"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </Badge>
            )}

            <div className="text-center mb-6">
              <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center", plan.color)}>
                <plan.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">
                  {billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                </span>
                {billingCycle === "annual" && plan.annualDisplay && (
                  <span className="text-gray-400 ml-2">/month</span>
                )}
              </div>
              {billingCycle === "annual" && plan.annualSavings && (
                <p className="text-green-400 text-sm font-medium">{plan.annualSavings}</p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleChoosePlan(plan.name)}
              className={cn(
                "w-full py-3 font-semibold transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30"
              )}
            >
              {plan.name === "Dream Lite" ? "Get Started Free" : `Choose ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12">
        <p className="text-gray-400 text-sm mb-4">
          All plans include secure payment processing via Stripe
        </p>
        <p className="text-gray-500 text-xs">
          Cancel anytime. No hidden fees. 30-day money-back guarantee.
        </p>
      </div>
    </div>
  )
}

export default Pricing



