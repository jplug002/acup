import Hero from "@/components/Hero"
import CountryCarousel from "@/components/CountryCarousel"
import EventsSection from "@/components/EventsSection"
import AboutSection from "@/components/AboutSection"
import VisionSection from "@/components/VisionSection"
import MissionSection from "@/components/MissionSection"
import CTASection from "@/components/CTASection"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CountryCarousel />
      <EventsSection />
      <AboutSection />
      <VisionSection />
      <MissionSection />
      <CTASection />
    </main>
  )
}
