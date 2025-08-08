"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Crown, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

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

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-glow mb-4">Choose Your Spiritual Path</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">Start free and upgrade as your journey deepens</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/5 rounded-xl p-1 border border-white/10">
          <div className="flex">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-6 py-2 rounded-lg transition-all",
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
                  "px-6 py-2 rounded-lg transition-all",
                  billingCycle === "annual"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10",
                )}
              >
                Annual
              </Button>
              <Badge className="absolute -top-4 -right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {dreamVaultPlans.map((plan) => {
          const Icon = plan.icon
          const isFree = plan.monthlyPrice === "Free"
          const displayPrice = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice
          return (
            <div
              key={plan.name}
              className={cn(
                "glass-card rounded-2xl p-6 text-center relative flex flex-col h-full",
                plan.popular && "border-purple-500/50 glow",
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">Most Popular</Badge>
              )}

              <Icon className={cn("h-12 w-12 mx-auto mb-4", plan.color)} />
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-2">{displayPrice}</p>
              {billingCycle === "annual" && plan.annualDisplay && plan.name !== "Dream Lite" && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400">{plan.annualDisplay}</p>
                  {plan.annualSavings && (
                    <p className="text-sm text-green-400 font-medium">{plan.annualSavings}</p>
                  )}
                </div>
              )}

              <ul className="space-y-3 mb-6 flex-grow text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" className="mt-auto">
                <Button
                  className={cn(
                    "w-full",
                    plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "bg-white/10 hover:bg-white/20",
                  )}
                >
                  {isFree ? "Interpret Dream" : "Choose Plan"}
                </Button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing


