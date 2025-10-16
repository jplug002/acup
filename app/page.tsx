"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Hero from "@/components/Hero"
import CountryCarousel from "@/components/CountryCarousel"
import AboutSection from "@/components/AboutSection"
import VisionSection from "@/components/VisionSection"
import MissionSection from "@/components/MissionSection"
import CTASection from "@/components/CTASection"

export default function HomePage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(false)
  const welcomeParam = searchParams.get("welcome")

  useEffect(() => {
    if (welcomeParam === "true" && session?.user) {
      setShowWelcome(true)
      // Hide welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [welcomeParam, session])

  return (
    <main>
      {showWelcome && session?.user && (
        <div className="bg-green-600 text-white py-4 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-lg font-medium">Welcome {session.user.name}! 🎉</p>
            <p className="text-sm mt-1">You have successfully logged into your ACUP account.</p>
          </div>
        </div>
      )}

      <Hero />
      <CountryCarousel />
      <AboutSection />
      <VisionSection />
      <MissionSection />
      <CTASection />
    </main>
  )
}
