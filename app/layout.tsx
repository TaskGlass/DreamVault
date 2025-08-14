import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/lib/userContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DreamVault - AI Dream Interpretation",
  description:
    "Unlock the secrets of your dreams with AI-powered interpretations, tarot readings, and personalized insights",
  generator: 'v0.dev',
  icons: {
    icon: '/logo2.svg',
    shortcut: '/logo2.svg',
    apple: '/logo2.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <UserProvider>
            <div className="min-h-screen bg-black">{children}</div>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
