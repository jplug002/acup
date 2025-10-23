"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CountryCarousel = () => {
  // Updated with all four unique new images and added Kenya
  const countries = [
    { name: "Ghana", image: "/IMG-20251017-WA0000.jpg" },
    { name: "South Africa", image: "/IMG-20251017-WA0001.jpg" },
    { name: "Kenya", image: "/IMG-20251017-WA0002.jpg" },
    { name: "Côte d'Ivoire", image: "/IMG-20251017-WA0003.jpg" },
    // You can add more countries here as needed
  ]

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {countries.map((country, index) => (
                <div 
                  key={index} 
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_80%] md:flex-[0_0_50%] pl-4"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow h-full mx-2">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={country.image}
                        alt={`ACUP in ${country.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                        priority
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-center text-gray-800">{country.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 -ml-3"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 -mr-3"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {countries.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${selectedIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}  
          </div>
        </div>
      </div>
    </section>
  )
}

export default CountryCarousel
