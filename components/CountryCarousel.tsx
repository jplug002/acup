import Image from "next/image"

const CountryCarousel = () => {
  // Using the new images but maintaining the original grid layout
  const countries = [
    { name: "Ghana", image: "/IMG-20251009-WA0018.jpg" },
    { name: "South Africa", image: "/IMG-20251009-WA0020(2) copy.jpg" },
    { name: "Guinea", image: "/IMG-20251009-WA0018.jpg" },
    { name: "Côte d'Ivoire", image: "/IMG-20251009-WA0020(2) copy.jpg" },
  ]

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-800">
          ACUP Across Africa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={country.image}
                  alt="ACUP Event Photo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CountryCarousel
