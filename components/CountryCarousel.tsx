import Image from "next/image"

const CountryCarousel = () => {
  // Updated with all four unique new images
  const countries = [
    { name: "Ghana", image: "/IMG-20251017-WA0000.jpg" },
    { name: "South Africa", image: "/IMG-20251017-WA0001.jpg" },
    { name: "Guinea", image: "/IMG-20251017-WA0002.jpg" },
    { name: "Côte d'Ivoire", image: "/IMG-20251017-WA0003.jpg" },
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
                  src={country.image || "/placeholder.svg"}
                  alt={`ACUP in ${country.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-center text-gray-800">{country.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CountryCarousel
