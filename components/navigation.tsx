"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, BarChart3, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "Readings", href: "/readings", icon: Sparkles },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-card mx-4 mb-6 rounded-2xl p-2">
          <div className="flex justify-around">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-xl transition-all",
                    isActive ? "bg-purple-500/20 text-purple-300" : "text-gray-400 hover:text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-64">
        <div className="glass-card h-[calc(100vh-2rem)] m-4 rounded-2xl p-6">
          <div className="flex items-center mb-8">
            <Sparkles className="h-8 w-8 text-purple-400 mr-3" />
            <h1 className="text-xl font-bold text-glow">DreamVault</h1>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all",
                    isActive
                      ? "bg-purple-500/20 text-purple-300 glow"
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
